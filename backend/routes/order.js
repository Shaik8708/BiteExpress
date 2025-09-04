const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your SQLite connection

/**
 * POST /api/orders
 * Body example:
 * {
 *   "user_id": 45,
 *   "shipping_address": "123 Main St",
 *   "status": "pending",
 *   "order_items": [
 *     { "product_id": 1, "quantity": 2, "price": 16.85 },
 *     { "product_id": 5, "quantity": 1, "price": 32.85 }
 *   ]
 * }
 */

// GET /api/orders - list all orders with items
router.get("/", (req, res) => {
  const { status, page = 1, page_size = 10 } = req.query;

  // Parse and calculate offset from page & page_size
  const pageNum = parseInt(page) > 0 ? parseInt(page) : 1;
  const pageSizeNum = parseInt(page_size) > 0 ? parseInt(page_size) : 10;
  const offset = (pageNum - 1) * pageSizeNum;

  // Base SQL with join to users, include o.id for mapping order items
  let baseSql = `
    SELECT 
      o.id, o.created_at, o.updated_at, o.total_amount, o.status, o.shipping_address,
      u.username, u.name, o.user_id
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
  `;

  let countSql = `SELECT COUNT(*) as count FROM orders o`;

  const params = [];

  // Add filtering for status if requested
  if (status) {
    baseSql += ` WHERE o.status = ?`;
    countSql += ` WHERE o.status = ?`;
    params.push(status);
  }

  baseSql += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
  params.push(pageSizeNum, offset);

  db.get(countSql, status ? [status] : [], (countErr, countRow) => {
    if (countErr) return res.status(500).json({ error: countErr.message });
    const totalCount = countRow.count;

    db.all(baseSql, params, (err, orders) => {
      if (err) return res.status(500).json({ error: err.message });

      const orderIds = orders.map((order) => order.id);

      if (orderIds.length === 0) {
        return res.json({
          totalCount,
          orders: [],
          page: pageNum,
          page_size: pageSizeNum,
        });
      }

      // Get order items for these orders with product info
      const placeholders = orderIds.map(() => "?").join(",");
      const itemsSql = `
        SELECT oi.order_id, oi.quantity, oi.price, p.name as product_name, p.image_url
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id IN (${placeholders})
      `;

      db.all(itemsSql, orderIds, (itemsErr, items) => {
        if (itemsErr) return res.status(500).json({ error: itemsErr.message });

        const orderItemsMap = {};
        items.forEach((item) => {
          if (!orderItemsMap[item.order_id]) orderItemsMap[item.order_id] = [];
          orderItemsMap[item.order_id].push(item);
        });

        // Fetch feedback for these orders
        const feedbackSql = `
          SELECT order_id, user_id, rating, comments, created_at
          FROM feedback
          WHERE order_id IN (${placeholders})
        `;

        db.all(feedbackSql, orderIds, (feedbackErr, feedbackRows) => {
          if (feedbackErr)
            return res.status(500).json({ error: feedbackErr.message });

          // Map feedback by order_id for easy attachment
          const feedbackMap = {};
          feedbackRows.forEach((fb) => {
            // If multiple feedbacks exist (rare), take the first or override
            feedbackMap[fb.order_id] = fb;
          });

          // Construct final result with feedback attached
          const responseOrders = orders.map((order) => ({
            id: order.id,
            created_at: order.created_at,
            updated_at: order.updated_at,
            total_amount: order.total_amount,
            status: order.status,
            shipping_address: order.shipping_address,
            user: {
              username: order.username,
              name: order.name,
            },
            order_items: orderItemsMap[order.id] || [],
            feedback: feedbackMap[order.id] || null,
          }));

          res.json({
            totalCount,
            page: pageNum,
            page_size: pageSizeNum,
            orders: responseOrders,
          });
        });
      });
    });
  });
});

// GET /api/orders/user/:username?page=1&page_size=10
router.get("/user/:username", (req, res) => {
  const username = req.params.username;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.page_size) || 10;
  const offset = (page - 1) * pageSize;

  const orderSql = `
    SELECT 
      o.id, o.created_at, o.updated_at, o.total_amount, o.status, o.shipping_address,
      u.username, u.name, u.id as userId
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE u.username = ?
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.all(orderSql, [username, pageSize, offset], (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!orders || orders.length === 0) {
      return res.json({ totalCount: 0, page, page_size: pageSize, orders: [] });
    }

    const countSql = `
      SELECT COUNT(*) as count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE u.username = ?
    `;

    db.get(countSql, [username], (countErr, countRow) => {
      if (countErr) return res.status(500).json({ error: countErr.message });
      const totalCount = countRow.count;

      const orderIds = orders.map((order) => order.id);
      const placeholders = orderIds.map(() => "?").join(",");

      const itemsSql = `
        SELECT oi.order_id, oi.quantity, oi.price, p.id as product_id, p.name as product_name, p.image_url, p.description
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id IN (${placeholders})
      `;

      db.all(itemsSql, orderIds, (itemsErr, items) => {
        if (itemsErr) return res.status(500).json({ error: itemsErr.message });

        // Map order items to orders
        const orderItemsMap = {};
        items.forEach((item) => {
          if (!orderItemsMap[item.order_id]) orderItemsMap[item.order_id] = [];
          orderItemsMap[item.order_id].push(item);
        });

        // Fetch feedback for these orders for this user
        const userId = orders[0].userId; // All orders belong to same user
        const feedbackSql = `
          SELECT order_id, rating, comments, created_at
          FROM feedback
          WHERE order_id IN (${placeholders}) AND user_id = ?
        `;

        db.all(
          feedbackSql,
          [...orderIds, userId],
          (feedbackErr, feedbackRows) => {
            if (feedbackErr)
              return res.status(500).json({ error: feedbackErr.message });

            // Map feedback to orders by order_id
            const feedbackMap = {};
            feedbackRows.forEach((fb) => {
              feedbackMap[fb.order_id] = fb;
            });

            // Construct final orders array with items and feedback
            const responseOrders = orders.map((order) => ({
              id: order.id,
              created_at: order.created_at,
              updated_at: order.updated_at,
              total_amount: order.total_amount,
              status: order.status,
              shipping_address: order.shipping_address,
              user: {
                username: order.username,
                name: order.name,
              },
              order_items: orderItemsMap[order.id] || [],
              feedback: feedbackMap[order.id] || null,
            }));

            res.json({
              totalCount,
              page,
              page_size: pageSize,
              orders: responseOrders,
            });
          }
        );
      });
    });
  });
});

router.post("/", async (req, res) => {
  const { user_id, shipping_address, status, order_items, payment_type } =
    req.body;

  if (
    !user_id ||
    !order_items ||
    !Array.isArray(order_items) ||
    order_items.length === 0
  ) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  // Validate payment_type
  const validPaymentTypes = ["UPI", "Cash on Delivery"];
  if (!payment_type || !validPaymentTypes.includes(payment_type.trim())) {
    return res.status(400).json({
      error: "Invalid payment_type. Allowed values: 'UPI', 'Cash on Delivery'.",
    });
  }

  // Extract unique product IDs from order_items
  const productIds = [...new Set(order_items.map((item) => item.product_id))];

  // Fetch prices from products table
  db.all(
    `SELECT id, price FROM products WHERE id IN (${productIds
      .map(() => "?")
      .join(",")})`,
    productIds,
    (err, productRows) => {
      if (err) return res.status(500).json({ error: err.message });

      // Map product price by product ID
      const priceMap = {};
      productRows.forEach((p) => {
        priceMap[p.id] = p.price;
      });

      // Calculate total amount based on DB prices and quantities
      let total_amount = 0;
      for (const item of order_items) {
        const price = priceMap[item.product_id];
        if (price === undefined) {
          return res
            .status(400)
            .json({ error: `Product ID ${item.product_id} not found.` });
        }
        total_amount += price * item.quantity;
      }

      // Prepare formatted IST timestamp
      const now = new Date();
      const istDate = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      );

      const yyyy = istDate.getFullYear();
      const mm = String(istDate.getMonth() + 1).padStart(2, "0");
      const dd = String(istDate.getDate()).padStart(2, "0");
      const hh = String(istDate.getHours()).padStart(2, "0");
      const min = String(istDate.getMinutes()).padStart(2, "0");
      const ss = String(istDate.getSeconds()).padStart(2, "0");
      let formattedIST = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

      // Insert order and items within a transaction
      db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        const insertOrderSql = `INSERT INTO orders
          (user_id, total_amount, status, shipping_address, payment_type, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.run(
          insertOrderSql,
          [
            user_id,
            total_amount,
            status || "pending",
            shipping_address || "",
            payment_type.trim(),
            formattedIST,
            formattedIST,
          ],
          function (err) {
            if (err) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: err.message });
            }

            const orderId = this.lastID;

            const insertItemSql = `INSERT INTO order_items
              (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
            const itemInsertStmt = db.prepare(insertItemSql);

            let hadError = false;

            order_items.forEach((item) => {
              const price = priceMap[item.product_id];
              itemInsertStmt.run(
                orderId,
                item.product_id,
                item.quantity,
                price,
                (err) => {
                  if (err && !hadError) {
                    hadError = true;
                    itemInsertStmt.finalize(() => {
                      db.run("ROLLBACK");
                      return res.status(500).json({ error: err.message });
                    });
                  }
                }
              );
            });

            itemInsertStmt.finalize((err) => {
              if (err && !hadError) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: err.message });
              }
              if (!hadError) {
                db.run("COMMIT");
                return res
                  .status(201)
                  .json({ message: "Order created", order_id: orderId });
              }
            });
          }
        );
      });
    }
  );
});

router.patch("/:id", (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }
  const now = new Date();
  const istDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const yyyy = istDate.getFullYear();
  const mm = String(istDate.getMonth() + 1).padStart(2, "0");
  const dd = String(istDate.getDate()).padStart(2, "0");
  const hh = String(istDate.getHours()).padStart(2, "0");
  const min = String(istDate.getMinutes()).padStart(2, "0");
  const ss = String(istDate.getSeconds()).padStart(2, "0");
  let formattedIST = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

  const updateSql = `UPDATE orders SET status = ?, updated_at = ? WHERE id = ?`;

  db.run(updateSql, [status, formattedIST, orderId], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: `Order ${orderId} status updated to ${status}` });
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST /api/products
router.post("/", (req, res) => {
  const { name, description, price, image_url, category, available } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: "Name and price are required." });
  }
  const sql = `INSERT INTO products (name, description, price, image_url, category, available)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(
    sql,
    [name, description, price, image_url, category, available ?? 1],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "DB error: " + err.message });
      }
      res
        .status(201)
        .json({ message: "Product added", product_id: this.lastID });
    }
  );
});

// GET /api/products - fetch all products
router.get("/", (req, res) => {
  let { page, pageSize, category, admin } = req.query;

  const hasPagination = page !== undefined || pageSize !== undefined;

  // Show available products only unless admin=true
  const showAvailableOnly = !(admin === "true");

  // Base condition: either available=1 or no filter
  let baseCondition = showAvailableOnly ? "available = 1" : "1=1";

  if (!hasPagination) {
    let sql = "SELECT * FROM products WHERE " + baseCondition;
    const params = [];

    if (category) {
      sql += " AND category = ?";
      params.push(category);
    }

    db.all(sql, params, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        page: 1,
        pageSize: rows.length,
        totalPages: 1,
        totalItems: rows.length,
        products: rows,
      });
    });
  } else {
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 10;
    const offset = (page - 1) * pageSize;

    let sql = "SELECT * FROM products WHERE " + baseCondition;
    let countSql =
      "SELECT COUNT(*) AS total FROM products WHERE " + baseCondition;
    const params = [];
    const countParams = [];

    if (category) {
      sql += " AND category = ?";
      countSql += " AND category = ?";
      params.push(category);
      countParams.push(category);
    }

    sql += " LIMIT ? OFFSET ?";
    params.push(pageSize, offset);

    db.get(countSql, countParams, (err, countResult) => {
      if (err) return res.status(500).json({ error: err.message });

      const total = countResult.total;

      db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
          totalItems: total,
          products: rows,
        });
      });
    });
  }
});

// PATCH /api/products/:id - patch product bu id
router.patch("/:id", (req, res) => {
  const productId = req.params.id;
  const updates = req.body;
  console.log(req.body);

  // Build query dynamically for fields passed in the request body
  const fields = Object.keys(updates);
  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update provided" });
  }

  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => updates[field]);
  values.push(productId);

  const sql = `UPDATE products SET ${setClause} WHERE id = ?`;

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated successfully" });
  });
});

// DELETE /api/products/:id - delete product by id
router.delete("/:id", (req, res) => {
  const productId = req.params.id;

  const sql = "DELETE FROM products WHERE id = ?";
  db.run(sql, productId, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});

// GET /api/products/:id - fetch product by its ID
router.get("/:id", (req, res) => {
  const productId = req.params.id;

  const sql = "SELECT * FROM products WHERE id = ?";
  db.get(sql, [productId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ product: row });
  });
});

module.exports = router;

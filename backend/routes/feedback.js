const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your SQLite connection

router.post("/", (req, res) => {
  const { order_id, user_id, rating, comments } = req.body;

  if (!order_id || !user_id) {
    return res
      .status(400)
      .json({ error: "order_id and user_id are required." });
  }
  // Check if feedback already exists for this order and user
  db.get(
    "SELECT feedback_id FROM feedback WHERE order_id = ? AND user_id = ?",
    [order_id, user_id],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (row) {
        return res
          .status(409)
          .json({ error: "Feedback already submitted for this order." });
      }

      if (!order_id || !user_id) {
        return res
          .status(400)
          .json({ error: "order_id and user_id are required." });
      }
      if (rating && (rating < 1 || rating > 5)) {
        return res
          .status(400)
          .json({ error: "rating must be between 1 and 5." });
      }

      const now = new Date();
      const formattedDate = now.toISOString().slice(0, 19).replace("T", " ");

      const insertSql = `
        INSERT INTO feedback (order_id, user_id, rating, comments, created_at)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.run(
        insertSql,
        [order_id, user_id, rating || null, comments || null, formattedDate],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });

          res
            .status(201)
            .json({ message: "Feedback saved", feedback_id: this.lastID });
        }
      );
    }
  );
});

router.get("/admin/feedback", (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(pageSize);

  const countSql = `SELECT COUNT(*) AS total FROM feedback`;

  const selectSql = `
    SELECT f.feedback_id, f.order_id, f.rating, f.comments, f.created_at,
      o.status AS order_status,
      u.username, u.name
    FROM feedback f
    LEFT JOIN orders o ON f.order_id = o.id
    LEFT JOIN users u ON f.user_id = u.id
    ORDER BY f.created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.get(countSql, [], (countErr, countRow) => {
    if (countErr) return res.status(500).json({ error: countErr.message });

    db.all(selectSql, [parseInt(pageSize), offset], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        totalItems: countRow.total,
        totalPages: Math.ceil(countRow.total / pageSize),
        feedbacks: rows,
      });
    });
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Sample route to get all users
router.get("/", (req, res) => {
  const sql = "SELECT * FROM users";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ users: rows });
  });
});

// POST /api/user/register
router.post("/register", (req, res) => {
  const { name, username, password, is_admin } = req.body;

  if (!name || !username || !password || is_admin === undefined) {
    return res
      .status(400)
      .json({ error: "Please provide name, username, password" });
  }

  // Check if username already exists
  const checkSql = "SELECT * FROM users WHERE username = ?";
  db.get(checkSql, [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (row) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Insert new user
    const insertSql =
      "INSERT INTO users (name, username, password, is_admin) VALUES (?, ?, ?, ?)";
    db.run(insertSql, [name, username, password, is_admin], function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to register user" });
      }
      res
        .status(201)
        .json({ message: "User registered successfully", userId: this.lastID });
    });
  });
});

// POST /api/user/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const sql =
    "SELECT id, name, username, is_admin FROM users WHERE username = ? AND password = ?";
  db.get(sql, [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (!row) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Login successful - return user details (omit password)
    res.json({
      message: "Login successful",
      user: row,
    });
  });
});

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  const sql =
    "SELECT id, name, username, is_admin FROM users WHERE username = ? AND password = ? And is_admin = 1";
  db.get(sql, [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    if (!row) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Login successful - return user details (omit password)
    res.json({
      message: "Login successful",
      user: row,
    });
  });
});

// GET /api/users/username/:username - fetch user by username
router.get("/username/:username", (req, res) => {
  const username = req.params.username;

  const sql = `SELECT id, name, username, street_address, address_line_2, city, state, postal_code, country, phone_number
    FROM users
    WHERE username = ?`;
  db.get(sql, [username], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: row });
  });
});

// PATCH /api/users/:id - partial update for user, including address fields
router.patch("/:username", (req, res) => {
  const username = req.params.username;
  const updates = req.body;

  // Allowed fields including address and other user fields
  const allowedFields = [
    "name",
    "street_address",
    "address_line_2",
    "city",
    "state",
    "postal_code",
    "country",
    "phone_number",
    // add other user fields if needed
  ];

  // Filter updates to only allowed fields
  const fields = Object.keys(updates).filter((f) => allowedFields.includes(f));
  if (fields.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields to update provided" });
  }

  // Build SET clause dynamically
  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => updates[field]);
  values.push(username);

  const sql = `UPDATE users SET ${setClause} WHERE username = ?`;

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  });
});

module.exports = router;

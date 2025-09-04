const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your SQLite connection

router.post("/validate", (req, res) => {
  const { code, order_amount } = req.body;

  if (!code || order_amount == null) {
    return res
      .status(400)
      .json({ valid: false, error: "Missing code or order_amount" });
  }

  db.get(
    "SELECT * FROM coupons WHERE code = ? AND active = 1",
    [code.toUpperCase()],
    (err, coupon) => {
      if (err)
        return res.status(500).json({ valid: false, error: err.message });
      if (!coupon) {
        return res
          .status(404)
          .json({ valid: false, error: "Coupon code is invalid or inactive." });
      }

      let discount_amount = 0;
      if (coupon.discount_type === "percent") {
        discount_amount = (coupon.discount_value / 100) * order_amount;
      } else if (coupon.discount_type === "fixed") {
        discount_amount = coupon.discount_value;
      }

      if (discount_amount > order_amount) discount_amount = order_amount;

      const final_amount = order_amount - discount_amount;

      return res.json({
        valid: true,
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount,
        final_amount,
      });
    }
  );
});

module.exports = router;

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const ordersRoutes = require("./routes/order");
const feedbackRoutes = require("./routes/feedback");
const couponRoutes = require("./routes/coupon");

const app = express();
console.log("before app");

app.use(cors("*"));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/order", ordersRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/coupon", couponRoutes);
// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend/assets")));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

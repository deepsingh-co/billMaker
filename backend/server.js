require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoute");
const billsRoute = require("./routes/billsRoute");
const productRoutes = require("./routes/productRoutes");
const requireAuth = require("./middleware/requireAuth");
const connectDB = require("./config/db");

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Public authentication endpoints
app.use("/api/auth", authRoutes);

// Store data requires a valid JWT session.
app.use("/api/products", requireAuth, productRoutes);
app.use("/api/bills", requireAuth, billsRoute);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Barcode Suite API" });
});

const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");

// Save a bill
router.post("/add", async (req, res) => {
  try {
    const bill = new Bill(req.body);
    await bill.save();
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bills
router.get("/", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ date: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
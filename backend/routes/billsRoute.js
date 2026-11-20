const express = require("express");
const router = express.Router();
const Bill = require("../models/Bill");

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addDays(value, amount) {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
}

function dayKey(value) {
  const date = new Date(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function itemCount(bill) {
  return (bill.items || []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0
  );
}

function summarize(bills) {
  const summary = bills.reduce(
    (totals, bill) => ({
      revenue: totals.revenue + (Number(bill.totalAmount) || 0),
      bills: totals.bills + 1,
      itemsSold: totals.itemsSold + itemCount(bill),
    }),
    { revenue: 0, bills: 0, itemsSold: 0 }
  );
  summary.avgBill = summary.bills > 0 ? summary.revenue / summary.bills : 0;
  return summary;
}

// Dashboard analytics for the last N days, plus today/yesterday and the
// immediately preceding window so the client can render trend deltas.
router.get("/analytics", async (req, res) => {
  try {
    const parsedDays = Number.parseInt(req.query.days, 10);
    const rangeDays = Number.isFinite(parsedDays)
      ? Math.min(Math.max(parsedDays, 1), 90)
      : 7;

    const now = new Date();
    const todayStart = startOfDay(now);
    const yesterdayStart = addDays(todayStart, -1);
    const rangeStart = addDays(todayStart, -(rangeDays - 1));
    const previousStart = addDays(rangeStart, -rangeDays);

    const bills = await Bill.find({
      createdAt: { $gte: previousStart },
    })
      .sort({ createdAt: 1 })
      .lean();

    const currentBills = bills.filter(
      (bill) => new Date(bill.createdAt) >= rangeStart
    );
    const previousBills = bills.filter((bill) => {
      const createdAt = new Date(bill.createdAt);
      return createdAt >= previousStart && createdAt < rangeStart;
    });
    const todayBills = bills.filter(
      (bill) => new Date(bill.createdAt) >= todayStart
    );
    const yesterdayBills = bills.filter((bill) => {
      const createdAt = new Date(bill.createdAt);
      return createdAt >= yesterdayStart && createdAt < todayStart;
    });

    const dailyMap = new Map();
    for (let index = 0; index < rangeDays; index += 1) {
      const key = dayKey(addDays(rangeStart, index));
      dailyMap.set(key, { date: key, revenue: 0, bills: 0, items: 0 });
    }

    currentBills.forEach((bill) => {
      const bucket = dailyMap.get(dayKey(bill.createdAt));
      if (!bucket) return;
      bucket.revenue += Number(bill.totalAmount) || 0;
      bucket.bills += 1;
      bucket.items += itemCount(bill);
    });

    const productMap = new Map();
    currentBills.forEach((bill) => {
      (bill.items || []).forEach((item) => {
        const key = item.barcode || item.name;
        if (!key) return;
        const entry = productMap.get(key) || {
          name: item.name || "Unnamed product",
          barcode: item.barcode || "",
          quantity: 0,
          revenue: 0,
        };
        const quantity = Number(item.quantity) || 0;
        entry.quantity += quantity;
        entry.revenue += (Number(item.price) || 0) * quantity;
        productMap.set(key, entry);
      });
    });

    const topProducts = Array.from(productMap.values())
      .sort((first, second) => second.quantity - first.quantity)
      .slice(0, 6);

    res.json({
      rangeDays,
      generatedAt: now.toISOString(),
      today: summarize(todayBills),
      yesterday: summarize(yesterdayBills),
      current: summarize(currentBills),
      previous: summarize(previousBills),
      daily: Array.from(dailyMap.values()),
      topProducts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a bill. Totals are derived on the server so the stored amount always
// matches the line items, regardless of what the client sends.
router.post("/add", async (req, res) => {
  try {
    const rawItems = Array.isArray(req.body.items) ? req.body.items : [];
    if (rawItems.length === 0) {
      return res.status(400).json({ error: "A bill needs at least one item." });
    }

    const items = rawItems.map((item) => ({
      name: item.name,
      barcode: item.barcode,
      quantity: Number(item.quantity) || 0,
      price: Number(item.price) || 0,
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const bill = await Bill.create({ items, totalAmount });
    res.status(201).json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all bills, newest first.
router.get("/", async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

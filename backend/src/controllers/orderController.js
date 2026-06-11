const orderService = require("../services/orderService");

// Helper to handle async route handlers and eliminate try-catch boilerplate
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const create = asyncHandler(async (req, res) => {
  const { items } = req.body;
  const cashier_id = req.user.id;

  if (!items || items.length === 0) {
    return res
      .status(400)
      .json({ message: "Order must contain at least one item" });
  }

  const data = await orderService.createOrder({ items, cashier_id });
  res.status(201).json({ message: "Order created successfully", data });
});

const getAll = asyncHandler(async (req, res) => {
  const data = await orderService.getAll();
  res.json({ data });
});

const getById = asyncHandler(async (req, res) => {
  const data = await orderService.getById(req.params.id);
  if (!data) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json({ data });
});

const getRecentCompleted = asyncHandler(async (req, res) => {
  const limit = Math.max(1, parseInt(req.query.limit || "10", 10));
  const data = await orderService.getRecentCompleted({ limit });
  res.json({ data });
});

const getHourlySalesToday = asyncHandler(async (req, res) => {
  const data = await orderService.getHourlySalesToday();
  res.json({ data });
});

module.exports = {
  create,
  getAll,
  getById,
  getRecentCompleted,
  getHourlySalesToday,
};

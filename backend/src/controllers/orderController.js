const orderService = require("../services/orderService");

const create = async (req, res) => {
  try {
    const { items } = req.body;
    const cashier_id = req.user.id;
    const data = await orderService.createOrder({ items, cashier_id });
    return res.status(201).json({ message: "Order created successfully", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const data = await orderService.getAll();
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await orderService.getById(req.params.id);
    return res.json({ data });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

module.exports = { create, getAll, getById };

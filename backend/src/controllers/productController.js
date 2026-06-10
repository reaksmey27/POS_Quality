const productService = require("../services/productService");

const getAll = async (req, res) => {
  try {
    const data = await productService.getAll();
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await productService.getById(req.params.id);
    return res.json({ data });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await productService.create(req.body);
    return res.status(201).json({ message: "Product created", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = await productService.update(req.params.id, req.body);
    return res.json({ message: "Product updated", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const data = await productService.remove(req.params.id);
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };

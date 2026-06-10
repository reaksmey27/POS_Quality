const categoryService = require("../services/categoryService");

const getAll = async (req, res) => {
  try {
    const data = await categoryService.getAll();
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await categoryService.getById(req.params.id);
    return res.json({ data });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await categoryService.create(req.body);
    return res.status(201).json({ message: "Category created", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = await categoryService.update(req.params.id, req.body);
    return res.json({ message: "Category updated", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const data = await categoryService.remove(req.params.id);
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };

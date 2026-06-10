const categoryService = require("../services/categoryService");

// Helper to handle async route handlers and eliminate try-catch boilerplate
const asyncHandler = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

const getAll = asyncHandler(async (req, res) => {
  const data = await categoryService.getAll();
  res.json({ data });
});

const getById = asyncHandler(async (req, res) => {
  const data = await categoryService.getById(req.params.id);
  if (!data) {
    return res.status(404).json({ message: "Category not found" });
  }
  res.json({ data });
});

const create = asyncHandler(async (req, res) => {
  const data = await categoryService.create(req.body);
  res.status(201).json({ message: "Category created", data });
});

const update = asyncHandler(async (req, res) => {
  const data = await categoryService.update(req.params.id, req.body);
  res.json({ message: "Category updated", data });
});

const remove = asyncHandler(async (req, res) => {
  const data = await categoryService.remove(req.params.id);
  res.json({ message: "Category deleted", data });
});

module.exports = { getAll, getById, create, update, remove };
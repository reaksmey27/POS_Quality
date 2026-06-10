const productService = require("../services/productService");

// Helper to handle async route handlers and eliminate try-catch boilerplate
const asyncHandler = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

const getAll = asyncHandler(async (req, res) => {
  const data = await productService.getAll();
  res.json({ data });
});

const getById = asyncHandler(async (req, res) => {
  const data = await productService.getById(req.params.id);
  if (!data) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json({ data });
});

const create = asyncHandler(async (req, res) => {
  const data = await productService.create(req.body);
  res.status(201).json({ message: "Product created", data });
});

const update = asyncHandler(async (req, res) => {
  const data = await productService.update(req.params.id, req.body);
  res.json({ message: "Product updated", data });
});

const remove = asyncHandler(async (req, res) => {
  const data = await productService.remove(req.params.id);
  res.json({ message: "Product deleted", data });
});

module.exports = { getAll, getById, create, update, remove };
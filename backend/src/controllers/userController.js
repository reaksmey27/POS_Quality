const userService = require("../services/userService");

// Helper to handle async route handlers and eliminate try-catch boilerplate
const asyncHandler = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

const list = asyncHandler(async (req, res) => {
  const data = await userService.list();
  res.json({ data });
});

const getById = asyncHandler(async (req, res) => {
  const data = await userService.getById(req.params.id);
  if (!data) {
    return res.status(404).json({ message: "User not found" });
  }
  res.json({ data });
});

const create = asyncHandler(async (req, res) => {
  const data = await userService.create(req.body);
  res.status(201).json({ message: "User created", data });
});

const update = asyncHandler(async (req, res) => {
  const data = await userService.update(req.params.id, req.body);
  res.json({ message: "User updated", data });
});

const remove = asyncHandler(async (req, res) => {
  const data = await userService.remove(req.params.id, req.user.id);
  res.json({ message: "User deleted", data });
});

module.exports = { list, getById, create, update, remove };
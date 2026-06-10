const authService = require("../services/authService");

// Helper to handle async route handlers and eliminate try-catch boilerplate
const asyncHandler = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const user = await authService.register({ name, email, password, role });
  
  res.status(201).json({ message: "User registered successfully", data: user });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const result = await authService.login({ email, password });
  
  res.json({ message: "Login successful", data: result });
});

module.exports = { register, login };
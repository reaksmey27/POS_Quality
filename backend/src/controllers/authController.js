const authService = require("../services/authService");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    const user = await authService.register({ name, email, password, role });
    return res.status(201).json({ message: "User registered successfully", data: user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const result = await authService.login({ email, password });
    return res.status(200).json({ message: "Login successful", data: result });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

module.exports = { register, login };

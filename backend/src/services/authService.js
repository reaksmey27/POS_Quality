const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../config/data-source");
const User = require("../entities/User");

const ROLES = { ADMIN: 0, MANAGER: 1, CASHIER: 2 };
const VALID_ROLES = Object.values(ROLES);

const getUserRepo = () => AppDataSource.getRepository(User);

const register = async ({ name, email, password, role }) => {
  const repo = getUserRepo();
  
  const existing = await repo.findOne({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const parsedRole = parseInt(role, 10);
  const roleValue = VALID_ROLES.includes(parsedRole) ? parsedRole : ROLES.CASHIER;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = repo.create({ name, email, password: hashedPassword, role: roleValue });
  await repo.save(user);

  const { password: _, ...safeUser } = user;
  return safeUser;
};

const login = async ({ email, password }) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured on the server");
  }

  const repo = getUserRepo();
  const user = await repo.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const payload = { id: user.id, email: user.email, role: user.role, name: user.name };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || "7d" 
  });

  return { token, user: payload };
};

module.exports = { register, login };
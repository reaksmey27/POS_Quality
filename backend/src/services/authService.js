const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../config/data-source");
const User = require("../entities/User");

const getUserRepo = () => AppDataSource.getRepository(User);

const register = async ({ name, email, password, role }) => {
  const repo = getUserRepo();
  const existing = await repo.findOne({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);
  const rawRoleValue = role !== undefined ? parseInt(role) : 2;
  const roleValue = [0, 1, 2].includes(rawRoleValue) ? rawRoleValue : 2;
  const user = repo.create({ name, email, password: hashed, role: roleValue });

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

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

module.exports = { register, login };
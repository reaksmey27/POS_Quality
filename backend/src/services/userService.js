const bcrypt = require("bcryptjs");
const { AppDataSource } = require("../config/data-source");

const ROLES = { ADMIN: 0, MANAGER: 1, CASHIER: 2 };
const VALID_ROLES = Object.values(ROLES);

const getRepo = () => AppDataSource.getRepository("User");

const getRoleValue = (role) => {
  const parsedRole = parseInt(role, 10);
  return VALID_ROLES.includes(parsedRole) ? parsedRole : ROLES.CASHIER;
};

const toSafeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const list = async () => {
  const users = await getRepo().find({ order: { id: "DESC" } });
  return users.map(toSafeUser);
};

const getById = async (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) throw new Error("Invalid user ID format");

  const user = await getRepo().findOne({ where: { id: parsedId } });
  if (!user) throw new Error("User not found");
  
  return toSafeUser(user);
};

const create = async ({ name, email, password, role }) => {
  if (!name?.trim() || !email?.trim() || !password) {
    throw new Error("Name, email, and password are required");
  }

  const repo = getRepo();
  const existing = await repo.findOne({ where: { email: email.trim() } });
  if (existing) throw new Error("Email already registered");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = repo.create({
    name: name.trim(),
    email: email.trim(),
    password: hashedPassword,
    role: getRoleValue(role),
  });

  await repo.save(user);
  return toSafeUser(user);
};

const update = async (id, { name, email, password, role }) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) throw new Error("Invalid user ID format");

  const repo = getRepo();
  const user = await repo.findOne({ where: { id: parsedId } });
  if (!user) throw new Error("User not found");

  if (name !== undefined) user.name = name.trim();

  if (email !== undefined) {
    const trimmedEmail = email.trim();
    const existing = await repo.findOne({ where: { email: trimmedEmail } });
    if (existing && existing.id !== user.id) throw new Error("Email already registered");
    user.email = trimmedEmail;
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  if (role !== undefined) {
    user.role = getRoleValue(role);
  }

  await repo.save(user);
  return toSafeUser(user);
};

const remove = async (id, requesterId) => {
  const parsedId = parseInt(id, 10);
  const parsedRequesterId = parseInt(requesterId, 10);
  
  if (isNaN(parsedId)) throw new Error("Invalid user ID format");

  if (!isNaN(parsedRequesterId) && parsedId === parsedRequesterId) {
    throw new Error("You cannot delete your own account");
  }

  const repo = getRepo();
  const user = await repo.findOne({ where: { id: parsedId } });
  if (!user) throw new Error("User not found");

  await repo.remove(user);

  return toSafeUser(user);
};

module.exports = { list, getById, create, update, remove };
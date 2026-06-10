const bcrypt = require("bcryptjs");
const { AppDataSource } = require("../config/data-source");

const getRepo = () => AppDataSource.getRepository("User");

const roleValue = (role) => {
  const raw = role !== undefined ? parseInt(role) : 2;
  return [0, 1, 2].includes(raw) ? raw : 2;
};

const toSafeUser = (user) => {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
};

const list = async () => {
  const users = await getRepo().find({ order: { id: "DESC" } });
  return users.map(toSafeUser);
};

const getById = async (id) => {
  const user = await getRepo().findOne({ where: { id: parseInt(id) } });
  if (!user) throw new Error("User not found");
  return toSafeUser(user);
};

const create = async ({ name, email, password, role }) => {
  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  const existing = await getRepo().findOne({ where: { email } });
  if (existing) throw new Error("Email already registered");

  const hashed = await bcrypt.hash(password, 10);
  const user = getRepo().create({
    name,
    email,
    password: hashed,
    role: roleValue(role),
  });

  await getRepo().save(user);
  return toSafeUser(user);
};

const update = async (id, { name, email, password, role }) => {
  const repo = getRepo();
  const user = await repo.findOne({ where: { id: parseInt(id) } });
  if (!user) throw new Error("User not found");

  if (name !== undefined) user.name = name;

  if (email !== undefined) {
    const existing = await repo.findOne({ where: { email } });
    if (existing && existing.id !== user.id) throw new Error("Email already registered");
    user.email = email;
  }

  if (password !== undefined && password !== null && password !== "") {
    user.password = await bcrypt.hash(password, 10);
  }

  if (role !== undefined) user.role = roleValue(role);

  await repo.save(user);
  return toSafeUser(user);
};

const remove = async (id, requesterId) => {
  const repo = getRepo();
  const user = await repo.findOne({ where: { id: parseInt(id) } });
  if (!user) throw new Error("User not found");

  // prevent deleting self
  if (requesterId && parseInt(id) === parseInt(requesterId)) {
    throw new Error("You cannot delete your own account");
  }

  await repo.remove(user);
  return { message: "User deleted" };
};

module.exports = { list, getById, create, update, remove };


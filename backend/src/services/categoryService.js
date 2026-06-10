const { AppDataSource } = require("../config/data-source");

const getRepo = () => AppDataSource.getRepository("Category");

const getAll = async () => {
  return getRepo().find({ order: { id: "DESC" } });
};

const getById = async (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) throw new Error("Invalid category ID format");

  const category = await getRepo().findOne({ where: { id: parsedId } });
  if (!category) throw new Error("Category not found");
  
  return category;
};

const create = async ({ name, description }) => {
  if (!name?.trim()) throw new Error("Name is required");
  
  const category = getRepo().create({ name, description });
  return getRepo().save(category);
};

const update = async (id, { name, description }) => {
  const category = await getById(id);

  if (name !== undefined) category.name = name;
  if (description !== undefined) category.description = description;

  return getRepo().save(category);
};

const remove = async (id) => {
  const category = await getById(id);
  await getRepo().remove(category);

  return category;
};

module.exports = { getAll, getById, create, update, remove };
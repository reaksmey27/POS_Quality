const { AppDataSource } = require("../config/data-source");

const getRepo = () => AppDataSource.getRepository("Category");

const getAll = async () => {
  return await getRepo().find({ order: { id: "DESC" } });
};

const getById = async (id) => {
  const cat = await getRepo().findOne({ where: { id: parseInt(id) } });
  if (!cat) throw new Error("Category not found");
  return cat;
};

const create = async ({ name, description }) => {
  if (!name) throw new Error("Name is required");
  const cat = getRepo().create({ name, description });
  return await getRepo().save(cat);
};

const update = async (id, { name, description }) => {
  const cat = await getById(id);
  if (name) cat.name = name;
  if (description !== undefined) cat.description = description;
  return await getRepo().save(cat);
};

const remove = async (id) => {
  const cat = await getById(id);
  await getRepo().remove(cat);
  return { message: "Category deleted" };
};

module.exports = { getAll, getById, create, update, remove };

const { AppDataSource } = require("../config/data-source");

const getRepo = () => AppDataSource.getRepository("Product");

const getAll = async () => {
  return await getRepo().find({
    relations: ["category"],
    order: { id: "DESC" },
  });
};

const getById = async (id) => {
  const product = await getRepo().findOne({
    where: { id: parseInt(id) },
    relations: ["category"],
  });
  if (!product) throw new Error("Product not found");
  return product;
};

const create = async ({ name, price, qty, category_id, image }) => {
  if (!name || price === undefined)
    throw new Error("Name and price are required");
  if (isNaN(price) || parseFloat(price) < 0) throw new Error("Invalid price");

  const product = getRepo().create({
    name,
    price: parseFloat(price),
    qty: parseInt(qty) || 0,
    category_id: category_id ? parseInt(category_id) : null,
    image: image ? image : null,
  });

  return await getRepo().save(product);
};

const update = async (id, { name, price, qty, category_id, image }) => {
  const product = await getById(id);
  if (name) product.name = name;
  if (price !== undefined) product.price = parseFloat(price);
  if (qty !== undefined) product.qty = parseInt(qty);
  if (category_id !== undefined)
    product.category_id = category_id ? parseInt(category_id) : null;
  if (image !== undefined) product.image = image ? image : null;
  return await getRepo().save(product);
};

const remove = async (id) => {
  const product = await getById(id);
  await getRepo().remove(product);
  return { message: "Product deleted" };
};

module.exports = { getAll, getById, create, update, remove };

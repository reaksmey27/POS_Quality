const { AppDataSource } = require("../config/data-source");

const getRepo = () => AppDataSource.getRepository("Product");

const getAll = async () => {
  return getRepo().find({
    relations: ["category"],
    order: { id: "DESC" },
  });
};

const getById = async (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) throw new Error("Invalid product ID format");

  const product = await getRepo().findOne({
    where: { id: parsedId },
    relations: ["category"],
  });
  
  if (!product) throw new Error("Product not found");
  return product;
};

const create = async ({ name, price, qty, category_id, image }) => {
  if (!name?.trim()) throw new Error("Name is required");
  if (price === undefined || price === null || isNaN(price) || parseFloat(price) < 0) {
    throw new Error("Valid price is required");
  }

  const product = getRepo().create({
    name: name.trim(),
    price: parseFloat(price),
    qty: parseInt(qty, 10) || 0,
    category_id: category_id ? parseInt(category_id, 10) : null,
    image: image || null,
  });

  return getRepo().save(product);
};

const update = async (id, { name, price, qty, category_id, image }) => {
  const product = await getById(id);

  if (name !== undefined) product.name = name.trim();
  
  if (price !== undefined) {
    if (isNaN(price) || parseFloat(price) < 0) throw new Error("Invalid price value");
    product.price = parseFloat(price);
  }
  
  if (qty !== undefined) {
    const parsedQty = parseInt(qty, 10);
    if (isNaN(parsedQty) || parsedQty < 0) throw new Error("Invalid quantity value");
    product.qty = parsedQty;
  }
  
  if (category_id !== undefined) {
    product.category_id = category_id ? parseInt(category_id, 10) : null;
  }
  
  if (image !== undefined) {
    product.image = image || null;
  }

  return getRepo().save(product);
};

const remove = async (id) => {
  const product = await getById(id);
  await getRepo().remove(product);

  return product;
};

module.exports = { getAll, getById, create, update, remove };
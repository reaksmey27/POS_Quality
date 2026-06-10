const { AppDataSource } = require("../config/data-source");

const getOrderRepo = () => AppDataSource.getRepository("Order");
const getItemRepo = () => AppDataSource.getRepository("OrderItem");
const getProductRepo = () => AppDataSource.getRepository("Product");

const createOrder = async ({ items, cashier_id }) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  return await AppDataSource.transaction(async (manager) => {
    const productRepo = manager.getRepository("Product");
    const orderRepo = manager.getRepository("Order");
    const itemRepo = manager.getRepository("OrderItem");

    let total_price = 0;
    const resolvedItems = [];

    // Validate stock and calculate total
    for (const item of items) {
      const product = await productRepo.findOne({ where: { id: parseInt(item.product_id) } });
      if (!product) throw new Error(`Product ${item.product_id} not found`);

      const qty = parseInt(item.qty);
      if (!qty || qty <= 0) throw new Error(`Invalid quantity for product ${product.name}`);
      if (product.qty < qty) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.qty}`);
      }

      total_price += parseFloat(product.price) * qty;
      resolvedItems.push({ product, qty, price: parseFloat(product.price) });
    }

    // Create order
    const order = orderRepo.create({ total_price, cashier_id });
    await orderRepo.save(order);

    // Save order items and reduce stock
    for (const { product, qty, price } of resolvedItems) {
      const orderItem = itemRepo.create({
        order_id: order.id,
        product_id: product.id,
        qty,
        price,
      });
      await itemRepo.save(orderItem);

      product.qty -= qty;
      await productRepo.save(product);
    }

    return await orderRepo.findOne({
      where: { id: order.id },
      relations: ["items", "items.product", "cashier"],
    });
  });
};

const getAll = async () => {
  return await getOrderRepo().find({
    relations: ["items", "items.product", "cashier"],
    order: { id: "DESC" },
  });
};

const getById = async (id) => {
  const order = await getOrderRepo().findOne({
    where: { id: parseInt(id) },
    relations: ["items", "items.product", "cashier"],
  });
  if (!order) throw new Error("Order not found");
  return order;
};

module.exports = { createOrder, getAll, getById };

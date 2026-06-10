const { AppDataSource } = require("../config/data-source");

const getOrderRepo = () => AppDataSource.getRepository("Order");

const createOrder = async ({ items, cashier_id }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  return AppDataSource.transaction(async (manager) => {
    const productRepo = manager.getRepository("Product");
    const orderRepo = manager.getRepository("Order");
    const itemRepo = manager.getRepository("OrderItem");

    // 1. Fetch all products in a single database query instead of looping findOne
    const productIds = items.map(item => parseInt(item.product_id, 10)).filter(Boolean);
    const dbProducts = await productRepo.findByIds(productIds);
    const productMap = new Map(dbProducts.map(p => [p.id, p]));

    let totalPrice = 0;
    const resolvedItems = [];

    // 2. Validate stock allocations and process line-item calculations
    for (const item of items) {
      const productId = parseInt(item.product_id, 10);
      const product = productMap.get(productId);
      
      if (!product) throw new Error(`Product ID ${item.product_id} not found`);

      const qty = parseInt(item.qty, 10);
      if (isNaN(qty) || qty <= 0) throw new Error(`Invalid quantity for product "${product.name}"`);
      if (product.qty < qty) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.qty}`);
      }

      totalPrice += parseFloat(product.price) * qty;
      
      // Update the local object pointer reference directly
      product.qty -= qty; 
      
      resolvedItems.push({ product, qty, price: parseFloat(product.price) });
    }

    // 3. Persist the parent Order resource
    const order = orderRepo.create({ total_price: totalPrice, cashier_id });
    await orderRepo.save(order);

    // 4. Batch-save the Order items and batch-update the mutated product stocks
    const orderItemEntities = resolvedItems.map(({ product, qty, price }) => 
      itemRepo.create({ order_id: order.id, product_id: product.id, qty, price })
    );
    await itemRepo.save(orderItemEntities);
    await productRepo.save(dbProducts); // Saves all stock variations at once

    // 5. Return the hydrated order tree structure
    return orderRepo.findOne({
      where: { id: order.id },
      relations: ["items", "items.product", "cashier"],
    });
  });
};

const getAll = async () => {
  return getOrderRepo().find({
    relations: ["items", "items.product", "cashier"],
    order: { id: "DESC" },
  });
};

const getById = async (id) => {
  const parsedId = parseInt(id, 10);
  if (isNaN(parsedId)) throw new Error("Invalid order ID format");

  const order = await getOrderRepo().findOne({
    where: { id: parsedId },
    relations: ["items", "items.product", "cashier"],
  });
  
  if (!order) throw new Error("Order not found");
  return order;
};

module.exports = { createOrder, getAll, getById };
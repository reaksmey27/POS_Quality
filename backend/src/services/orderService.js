const { AppDataSource } = require("../config/data-source");

const getOrderRepo = () => AppDataSource.getRepository("Order");

const notificationService = require("./notificationService");

const createOrder = async ({ items, cashier_id }) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must have at least one item");
  }

  return AppDataSource.transaction(async (manager) => {
    const productRepo = manager.getRepository("Product");
    const orderRepo = manager.getRepository("Order");
    const itemRepo = manager.getRepository("OrderItem");

    // 1. Fetch all products in a single database query instead of looping findOne
    const productIds = items
      .map((item) => parseInt(item.product_id, 10))
      .filter(Boolean);
    const dbProducts = await productRepo.findByIds(productIds);
    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let totalPrice = 0;
    const resolvedItems = [];

    // 2. Validate stock allocations and process line-item calculations
    for (const item of items) {
      const productId = parseInt(item.product_id, 10);
      const product = productMap.get(productId);

      if (!product) throw new Error(`Product ID ${item.product_id} not found`);

      const qty = parseInt(item.qty, 10);
      if (isNaN(qty) || qty <= 0)
        throw new Error(`Invalid quantity for product "${product.name}"`);
      if (product.qty < qty) {
        throw new Error(
          `Insufficient stock for "${product.name}". Available: ${product.qty}`,
        );
      }

      totalPrice += parseFloat(product.price) * qty;
      product.qty -= qty;

      resolvedItems.push({ product, qty, price: parseFloat(product.price) });
    }

    // 3. Persist the parent Order resource
    const order = orderRepo.create({ total_price: totalPrice, cashier_id });
    await orderRepo.save(order);

    // 4. Batch-save the Order items and batch-update the mutated product stocks
    const orderItemEntities = resolvedItems.map(({ product, qty, price }) =>
      itemRepo.create({
        order_id: order.id,
        product_id: product.id,
        qty,
        price,
      }),
    );
    await itemRepo.save(orderItemEntities);
    await productRepo.save(dbProducts);

    // 5. Create stock notifications for updated product quantities
    for (const { product } of resolvedItems) {
      await notificationService.ensureStockNotificationsForProduct({ product });
    }

    // 6. Return the hydrated order tree structure
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

const getRecentCompleted = async ({ limit = 10 } = {}) => {
  return getOrderRepo().find({
    where: { status: "completed" },
    relations: ["items", "items.product", "cashier"],
    order: { id: "DESC" },
    take: limit,
  });
};

const getHourlySalesToday = async ({
  points = ["08:00", "12:00", "15:00", "18:00", "21:00"],
} = {}) => {
  const labelToHour = new Map(
    points.map((t) => {
      const [hh] = t.split(":");
      return [t, parseInt(hh, 10)];
    }),
  );

  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );

  const qb = getOrderRepo().createQueryBuilder("o");
  qb.select("EXTRACT(HOUR FROM o.created_at)", "hour")
    .addSelect("SUM(o.total_price)", "total")
    .where("o.status = :status", { status: "completed" })
    .andWhere("o.created_at >= :start", { start })
    .andWhere("o.created_at <= :end", { end })
    .groupBy("hour")
    .orderBy("hour", "ASC");

  const rows = await qb.getRawMany();
  const hourToTotal = new Map();
  for (const r of rows) {
    const h = parseInt(r.hour, 10)
    const total = parseFloat(r.total) || 0;
    if (!Number.isNaN(h)) hourToTotal.set(h, total);
  }

  // Map each label-time to the same hour bucket.
  const result = points.map((label) => {
    const hour = labelToHour.get(label);
    return {
      label,
      total_price: hourToTotal.get(hour) ?? 0,
    };
  });

  return result;
};

module.exports = {
  createOrder,
  getAll,
  getById,
  getRecentCompleted,
  getHourlySalesToday,
};

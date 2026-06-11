const { AppDataSource } = require("../config/data-source");

const getRepo = () => AppDataSource.getRepository("Notification");

const parseIntSafe = (v) => {
  const n = typeof v === "string" ? parseInt(v, 10) : v;
  return Number.isNaN(n) ? null : n;
};

const getStockLevel = (qty) => {
  if (qty < 5) return "critical_stock";
  if (qty < 20) return "low_stock";
  return null;
};

const getTodayKey = (dt) => {
  const d = new Date(dt);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
};

const findDeDup = async ({ type, message }) => {
  const repo = getRepo();
  const lastDayKey = getTodayKey(new Date());
  const existing = await repo.findOne({
    where: {
      type,
      message,
    },
    order: { id: "DESC" },
  });

  if (!existing) return null;

  const existingDayKey = getTodayKey(existing.created_at);
  if (existingDayKey !== lastDayKey) return null;

  return existing;
};

const listLatest = async ({ limit = 20 } = {}) => {
  const repo = getRepo();
  return repo.find({
    order: { id: "DESC" },
    take: limit,
  });
};

const markAllRead = async () => {
  const repo = getRepo();
  const allUnread = await repo.find({ where: { read_at: null } });
  const now = new Date();
  allUnread.forEach((n) => {
    n.read_at = now;
  });
  await repo.save(allUnread);
  return { updated: allUnread.length };
};

const createNotification = async ({ type, message }) => {
  const repo = getRepo();
  const n = repo.create({ type, message });
  return repo.save(n);
};

const ensureStockNotificationsForProduct = async ({ product }) => {
  // product: hydrated Product entity { id, name, qty }
  const qty = parseIntSafe(product?.qty) ?? 0;
  const level = getStockLevel(qty);
  if (!level) return null;

  const type = level;
  const message =
    level === "critical_stock"
      ? `Critical stock: ${product.name}`
      : `Low stock: ${product.name}`;

  // de-dup once per day per message
  const dayKey = getTodayKey(new Date());
  const existing = await findDeDup({ type, message, dayKey });
  if (existing) return existing;

  return createNotification({ type, message });
};

const createStockNotificationsForAllProducts = async () => {
  const productRepo = AppDataSource.getRepository("Product");
  const products = await productRepo.find({
    select: ["id", "name", "qty"],
  });

  const created = [];
  for (const p of products) {
    const n = await ensureStockNotificationsForProduct({ product: p });
    if (n) created.push(n);
  }
  return { createdCount: created.length };
};

module.exports = {
  listLatest,
  markAllRead,
  ensureStockNotificationsForProduct,
  createStockNotificationsForAllProducts,
  getStockLevel,
};

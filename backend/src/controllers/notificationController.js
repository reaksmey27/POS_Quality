const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const notificationService = require("../services/notificationService");

const getLatest = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
  const data = await notificationService.listLatest({
    limit: Number.isFinite(limit) ? limit : 20,
  });

  // frontend expects res.data.data (store does res.data?.data)
  res.json({ data });
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const data = await notificationService.markAllRead();
  res.json({ data });
});

module.exports = { getLatest, markAllAsRead };

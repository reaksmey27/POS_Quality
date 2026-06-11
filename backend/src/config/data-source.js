require("reflect-metadata");
const { DataSource } = require("typeorm");

const User = require("../entities/User");
const Category = require("../entities/Category");
const Product = require("../entities/Product");
const Order = require("../entities/Order");
const OrderItem = require("../entities/OrderItem");
const Notification = require("../entities/Notification");

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pos_system",
  synchronize: true,
  logging: true,
  entities: [User, Category, Product, Order, OrderItem, Notification],
});

module.exports = { AppDataSource };

const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "OrderItem",
  tableName: "order_items",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    order_id: {
      type: "int",
    },
    product_id: {
      type: "int",
    },
    qty: {
      type: "int",
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
  },
  relations: {
    order: {
      type: "many-to-one",
      target: "Order",
      joinColumn: { name: "order_id" },
      inverseSide: "items",
    },
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: { name: "product_id" },
    },
  },
});

const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    total_price: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    cashier_id: {
      type: "int",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    status: {
      type: "varchar",
      length: 20,
      default: "completed",
    },
  },
  relations: {
    cashier: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "cashier_id" },
      nullable: true,
    },
    items: {
      type: "one-to-many",
      target: "OrderItem",
      inverseSide: "order",
    },
  },
});

const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      length: 100,
    },
    email: {
      type: "varchar",
      length: 150,
      unique: true,
    },
    password: {
      type: "varchar",
      length: 255,
    },
    // 0 = Admin, 1 = Manager, 2 = Cashier
    role: {
      type: "tinyint",
      default: 2,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
});

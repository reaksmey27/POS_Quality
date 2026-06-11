const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Notification",
  tableName: "notifications",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    type: {
      type: "varchar",
      length: 50,
      default: "info",
    },

    message: {
      type: "varchar",
      length: 500,
    },

    created_at: {
      type: "timestamp",
      createDate: true,
    },

    read_at: {
      type: "timestamp",
      nullable: true,
    },
  },
});


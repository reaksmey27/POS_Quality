const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Category",
  tableName: "categories",
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
    description: {
      type: "text",
      nullable: true,
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
  relations: {
    products: {
      type: "one-to-many",
      target: "Product",
      inverseSide: "category",
    },
  },
});

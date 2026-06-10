const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      length: 150,
    },
    price: {
      type: "decimal",
      precision: 10,
      scale: 2,
    },
    qty: {
      type: "int",
      default: 0,
    },
    image: {
      type: "varchar",
      length: 255,
      nullable: true,
    },
    category_id: {
      type: "int",
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
    category: {
      type: "many-to-one",
      target: "Category",
      joinColumn: { name: "category_id" },
      nullable: true,
    },
  },
});

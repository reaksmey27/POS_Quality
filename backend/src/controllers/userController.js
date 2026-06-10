const userService = require("../services/userService");

const list = async (req, res) => {
  try {
    const data = await userService.list();
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const data = await userService.getById(req.params.id);
    return res.json({ data });
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const data = await userService.create(req.body);
    return res.status(201).json({ message: "User created", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = await userService.update(req.params.id, req.body);
    return res.json({ message: "User updated", data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const data = await userService.remove(req.params.id, req.user.id);
    return res.json(data);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { list, getById, create, update, remove };

import { RoleModel } from "../models/role.model.js";

export const getRoles = async (req, res, next) => {
  try {
    const roles = await RoleModel.getAll();
    res.json(roles);
  } catch (err) {
    next(err);
  }
};

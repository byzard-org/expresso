const User = require("../../models/userModel");
const Errors = require("../../../config/errors");

class ApiUserController {

  static async getAllUsers(req, res) {
    const errors = Errors.from(req, res);
    try {
      const limit = req.query.limit;

      const users = await (limit
        ? User.find().limit(parseInt(limit))
        : User.find());
      res.status(200).json(users);
    } catch (err) {
      res
        .status(500)
        .json({ error: err.message, code: errors.code.SERVER_ERROR.code });
    }
  }

  static async getUserById(req, res) {
    const errors = Errors.from(req, res);
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      errors.json(errors.code.USER_NOT_FOUND);
    }
  }

  static async getUserAttribute(req, res) {
    const errors = Errors.from(req, res);
    try {
      const user = await User.findById(req.params.id);
      if (!user[req.params.attr]) errors.json(errors.code.USER_ATTR_NOT_FOUND);
      else res.status(200).json(user[req.params.attr]);
    } catch (err) {
      errors.json(errors.code.USER_NOT_FOUND);
    }
  }
}

module.exports = ApiUserController;

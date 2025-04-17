const jwt = require("jsonwebtoken");
const AppService = require("../../services");
const Errors = require("../../../config/errors");

module.exports = (req, res, next) => {
  const errors = Errors.from(req, res);

  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return errors.json(errors.code.AUTH_TOKEN_MISSING);
  }

  try {
    const decoded = jwt.verify(token, AppService.config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return errors.json(errors.code.AUTH_TOKEN_INVALID);
  }
};

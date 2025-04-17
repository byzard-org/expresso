const Errors = require("../../config/errors");

exports.e500 = (req, res, next) => {
  const errors = Errors.from(req, res);
  errors.json(errors.code.SERVER_ERROR)
};

exports.e404 = (req, res, next) => {
  const errors = Errors.from(req, res);
  errors.json(errors.code.RESOURCE_NOT_FOUND);
};

exports.e400 = (req, res, next) => {
  const errors = Errors.from(req, res);
  errors.json(errors.code.INVALID_REQUEST);
};

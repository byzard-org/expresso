const Errors = require("../../config/errors");
const AppService = require("../services");

const config = AppService.config;

exports.e500 = (req, res, next) => {
  const error = Errors.from(req, res);
  res.status(500).render("error", {
    title: "500",
    devMode: config.isDev,
    message:
      req.error?.message && config.isDev
        ? req.error?.message
        : error.code.SERVER_ERROR.message,
  });
};

exports.e404 = (req, res, next) => {
  const error = Errors.from(req, res);
  res.status(404).render("error", {
    title: "404",
    devMode: config.isDev,
    message:
      req.error?.message && config.isDev
        ? req.error?.message
        : error.code.PAGE_NOT_FOUND.message,
  });
};

exports.e400 = (req, res, next) => {
  const error = Errors.from(req, res);
  res.status(400).render("error", {
    title: "400",
    devMode: config.isDev,
    message:
      req.error?.message && config.isDev
        ? req.error?.message
        : error.code.INVALID_REQUEST.message,
  });
};

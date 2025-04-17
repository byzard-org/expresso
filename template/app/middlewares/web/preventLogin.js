const ROUTES = require("../../routes/routes");
const jwt = require("jsonwebtoken");
const CookieService = require("../../services/cookies");
const AppService = require("../../services");

module.exports = (req, res, next) => {
  const token = CookieService.of(req, res).get(AppService.config.authToken);
  if (!token) {
    return next();
  }
  try {
    jwt.verify(token, AppService.config.jwtSecret);
    return res.redirect(ROUTES.BASE);
  } catch (err) {
      return next();
  }
};

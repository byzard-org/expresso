const ROUTES = require("../../routes/routes");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const Errors = require("../../../config/errors");

const CookieService = require("../../services/cookies");
const AppService = require("../../services");

module.exports = async (req, res, next) => {
  const { code } = Errors.from(req, res);
  const token = CookieService.of(req, res).get(AppService.config.authToken);
  if (!token) {
    return res.redirect(ROUTES.LOGIN);
  }
  try {
    const decoded = jwt.verify(token, AppService.config.jwtSecret);
    req.headers.authorization = token;
    req.user = decoded;
    const user = await User.findById(req.user.userId);
    if (!user) throw new Error(code.USER_NOT_FOUND);
    next();
  } catch (err) {
    return res.redirect(ROUTES.LOGOUT_EXPIRED);
  }
};

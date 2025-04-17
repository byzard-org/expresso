const { e400 } = require("../../middlewares/errorHandler");
const AuthService = require("../../services/auth");
const LangService = require("../../services/lang");
class HomeController {
  static async index(req, res) {
    try {
      const user = await AuthService.authUser(req);
      LangService.setVars(res, { name: user.email });
      return res.render("index", { user });
    } catch (err) {
      console.log(err.message);
      req.error = err;
      e400(req, res);
    }
  }
}

module.exports = HomeController;

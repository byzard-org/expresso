const CookieService = require("../../app/services/cookies");
const LangService = require("../../app/services/lang");

class Errors {
  constructor(req, res) {
    this.req = req;
    this.res = res;

    let errorsFile = require("./en");
    const lang =
      req.lang ??
      CookieService.of(req, res).get("lang") ??
      LangService.getLang();

    try {
      errorsFile = require(`./${lang}`);
    } catch (_) {}

    this.code = errorsFile.code;
  }

  static from(req, res) {
    return new Errors(req, res);
  }

  json(code = this.code.SERVER_ERROR) {
    return this.res.status(code.status).json(code);
  }
}

module.exports = Errors;
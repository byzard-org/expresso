const AppService = require("..");
const CookieService = require("../cookies");
const translations = require("./translations");

/**
 * Service for managing language settings, translations, and locale variables in the application.
 */
class LangService {

  /**
   * Application configuration object.
   * @type {object}
   * @private
   */
  static #config = AppService.config;

  /**
   * Default application language.
   * @type {string}
   * @private
   */
  static #lang = this.#config.appLang;

  /**
   * Sets the application language.
   * @param {string} [str=this.#lang] - The language to set.
   */
  static setLang = (str = this.#lang) => (this.#lang = str);

  /**
   * Gets the current application language.
   * @returns {string} The current language.
   */
  static getLang = () => this.#lang;

  /**
   * Replaces translation variables in the response locals.
   * This method loops through all the keys in the translations and replaces variables 
   * in the translation strings with values from the provided `vars` object.
   * 
   * @param {object} res - The response object.
   * @param {object} [vars={}] - An object containing variables to replace in the translation strings.
   */
  static setVars(res, vars = {}) {
    for (let key of Object.keys(res.locals.tr ?? {})) {
      for (let v of Object.keys(vars)) {
        const tr = res.locals.tr[key];
        res.locals.tr[key] = tr
          .replaceAll("\\$", "$$")
          .replaceAll(`\${${v}}`, vars[v])
          .replaceAll("$$", "$");
      }
    }
  }

  /**
   * Middleware function for setting the translation strings for the current request.
   * It will determine the appropriate language based on the request's query parameters, 
   * cookies, or fallback to the default language. It will populate the response locals with
   * the translations for the selected language.
   * 
   * @param {object} req - The request object.
   * @param {object} res - The response object.
   * @param {function} next - The next middleware function.
   */
  static tr(req, res, next) {
    res.locals.tr = {};

    let lang = req.query.lang;
    if (!translations[lang]) lang = CookieService.of(req, res).get("lang");
    if (!translations[lang]) lang = LangService.getLang();

    const translation = translations[lang];
    if (!translation) return next();

    CookieService.of(req, res).set("lang", lang);
    req.lang = lang;
    res.locals.lang = lang;
    res.locals.langs = Object.keys(translations);
    for (let key of Object.keys(translation)) {
      const tr = translations[lang][key];
      res.locals.tr[key.toUpperCase()] = tr;
      res.locals.tr[key.toLowerCase()] = tr;
    }
    next();
  }
}

module.exports = LangService;

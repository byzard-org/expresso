const AppService = require("..");

/**
 * Service for managing cookies in HTTP requests and responses.
 * Provides methods to get, set, and clear cookies, as well as to calculate cookie expiration times.
 */
class CookieService {
  /**
   * Configuration settings for the cookie service.
   * @type {object}
   * @private
   */
  static #config = AppService.config;

  /**
   * Creates an instance of CookieService.
   * @param {object} req - The request object, containing the cookies.
   * @param {object} res - The response object, used to set or clear cookies.
   */
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  /**
   * Factory method to create a new instance of CookieService.
   * @param {object} req - The request object, containing the cookies.
   * @param {object} res - The response object, used to set or clear cookies.
   * @returns {CookieService} A new instance of CookieService.
   */
  static of(req, res) {
    return new CookieService(req, res);
  }

  /**
   * Retrieves the value of a cookie by its name.
   * @param {string} name - The name of the cookie to retrieve.
   * @returns {string|undefined} The value of the cookie, or `undefined` if the cookie doesn't exist.
   */
  get(name) {
    return this.req.cookies[name];
  }

  /**
   * Sets a cookie with the specified name and value.
   * The cookie's expiration is determined by the `cookieMaxDate` configuration setting.
   * @param {string} name - The name of the cookie to set.
   * @param {string} value - The value of the cookie to set.
   */
  set(name, value) {
    const maxAge = this.#cookieAge(CookieService.#config.cookieMaxDate);
    this.res.cookie(name, value, { maxAge });
  }

  /**
   * Clears a cookie by its name.
   * @param {string} name - The name of the cookie to clear.
   * @returns {object} The response object to allow for method chaining.
   */
  clear(name) {
    return this.res.clearCookie(name);
  }

  /**
   * Calculates the expiration time for a cookie based on the provided duration string.
   * The string should contain a numeric value followed by a suffix (`s`, `m`, `h`, `d`) representing seconds, minutes, hours, or days.
   * @param {string} str - The string representing the duration (e.g., "5m", "2h").
   * @returns {number} The calculated expiration time in milliseconds.
   * @private
   */
  #cookieAge(str) {
    const numRegex = /\d+/;
    const num = str.match(numRegex);
    const suffix = str.replace(numRegex, "");

    const s = 1000;
    const m = 60 * s;
    const h = 60 * m;
    const d = 24 * h;
    const y = 365 * d;

    switch (suffix) {
      case "s":
        return num * s;
      case "m":
        return num * m;
      case "h":
        return num * h;
      case "d":
        return num * d;
      case "y":
        return num * y;
      default:
        return num;
    }
  }
}


module.exports = CookieService;
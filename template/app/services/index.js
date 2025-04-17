const config = require("../../config");

/**
 * Service for the currrent app.
 * Needs a configuration file
 */
class AppService {

  static config = config;

  /**
   * Initializes the AppService with the provided configuration.
   *
   * @param {Object} config - The configuration object to set for the application.
   */
  static init(config) {
    this.config = config;
  }
  
}

module.exports = AppService;

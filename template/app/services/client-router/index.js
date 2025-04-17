const ROUTES = require("../../routes/routes");
const path = require("path");
const RoutesService = require("../routes");

/**
 * Service for managing client-side routing and view rendering.
 * It provides methods for registering routes and rendering views dynamically.
 */
class ClientRouterService {
  /**
   * Base path for client routes.
   * @type {string}
   */
  static basePath = ROUTES.CLIENT_ROUTER;

  /**
   * Directory path for client views.
   * @type {string}
   */
  static viewPath = "../client/";

  /**
   * Express router instance for handling client routes.
   * @type {object}
   */
  static router = require("express").Router();

  /**
   * The Express app instance.
   * @type {object}
   * @private
   */
  static #app;

  #base;
  
  /**
   * Creates an instance of ClientRouterService.
   * @param {string} base - The base path to be used for the router.
   */
  constructor(base) {
    this.#base = base;
  }

  /**
   * Factory method to create a new instance of ClientRouterService.
   * @param {string} base - The base path to be used for the router.
   * @returns {ClientRouterService} A new instance of ClientRouterService.
   */
  static of(base) {
    return new ClientRouterService(base);
  }

  /**
   * Renders a client-side view with provided data.
   * @param {string} view - The name of the view to render.
   * @param {object} res - The response object to send the rendered view.
   * @param {object} data - The data to be passed to the view.
   * @returns {Promise<string>} A promise that resolves to the rendered HTML of the view.
   * @private
   */
  static #renderView(view, res, data) {
    return new Promise((resolve, rej) => {
      res.render(this.viewPath + view, data, (err, renderedText) => {
        if (err) {
          console.error(err);
          rej("Error when rendering view.");
        } else {
          resolve(renderedText);
        }
      });
    });
  }

  /**
   * Cleans a route string by removing or replacing certain characters.
   * @param {string} [str=""] - The string to clean.
   * @returns {string} The cleaned route string.
   * @private
   */
  static #cleanRoute(str = "") {
    var s = str;
    function replace(chars, c) {
      for (let char of chars) {
        s = s.replaceAll(char.toLowerCase(), c.toLowerCase());
        s = s.replaceAll(char.toUpperCase(), c.toUpperCase());
      }
    }

    replace("èéêë", "e");
    replace("àâä", "a");
    replace("ôöò", "o");
    replace("ïîì", "i");
    replace(",;+", "");
    replace("&.", "_");
    s = s.replaceAll(/[^\x00-\x7F]/g, "");
    s = s.trim();
    replace(" ", "-");

    return s;
  }

  /**
   * Initializes the client router service by setting up the base route and loading the necessary controllers.
   * @param {object} app - The Express app instance to be used by the service.
   */
  static init(app) {
    app.use(this.basePath, this.router);
    this.#app = app;
    require("../../controllers/client");
  }

  /**
   * Registers a route and associates it with a view and data callback.
   * @param {object} routeConfig - The configuration object for the route.
   * @param {string} routeConfig.clientView - The name of the view to render when the route is accessed.
   * @param {string} [routeConfig.route] - The route path for the route. If not provided, it's derived from the view name.
   * @param {function|object} dataCallback - A callback function or static data to be passed to the view.
   * @returns {ClientRouterService} The current instance of ClientRouterService for method chaining.
   */
  register({ clientView, route }, dataCallback) {
    if (!clientView) return;

    var ext = path.extname(clientView);

    if (!route)
      route = clientView
        .replaceAll(path.sep, "/")
        .replaceAll("index" + ext, "")
        .replaceAll(ext, "")
        .replaceAll(" ", "-")
        .replaceAll("$", ":");

    route = ClientRouterService.#cleanRoute(route);

    const routeService = RoutesService.find(this.#base);
    if (routeService)
      ClientRouterService.#app.get(route, ...routeService.middlewares);

    ClientRouterService.router.get(route, async (req, res) => {
      try {
        const isFunction = typeof dataCallback === "function";
        const data = isFunction ? await dataCallback(req, res) : dataCallback;
        res.send(await ClientRouterService.#renderView(clientView, res, data));
      } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
      }
    });
    return this;
  }
}

module.exports = ClientRouterService;

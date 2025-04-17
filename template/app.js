const config = require("./config");
require("./app/services").init(config);
require("./tailwind.global"); 

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const api_routes = require("./app/routes/api");
const web_routes = require("./app/routes/web");
const logger = require("./app/utils/logger");
const errorHandler = require("./app/middlewares/errorHandler");
const ROUTES = require("./app/routes/routes");
const cors = require("cors");
const path = require("path");

const UploadService = require("./app/services/upload");
const ClientRouterService = require("./app/services/client-router");
const LangService = require("./app/services/lang");
const RoutesService = require("./app/services/routes");
const DBService = require("./app/services/db");
const Limiter = require("./app/middlewares/limiter");
const Utils = require("./app/utils");
const GoogleAuthService = require("./app/services/auth/google");
const AuthController = require("./app/controllers/web/authController");
const ejsMiddleware = require("./app/middlewares/ejs-middleware");
const themeMiddleware = require("./app/middlewares/theme-middleware");

const app = express();

const apiLimiter = Limiter({ maxLimit: 5, timeDelay: Utils.toMs({ s: 2 }) });// Limit users to 5 requests each 2s


// Static Files
const buildDir = "public";
app.use(express.static(path.join(__dirname, buildDir)));

app.use(cors());
app.use(cookieParser(config.jwtSecret));
app.use(bodyParser.json({ limit: config.parserJsonLimit }));
app.use(bodyParser.urlencoded({ extended: true, limit: config.parserLimit }));

// Middlewares
app.use(LangService.tr);
app.use(RoutesService.router);


// EJS Template Engine
app.set("view engine", "ejs");
app.set("views", "app/views/pages");

app.use(themeMiddleware);
app.use(ejsMiddleware);


// Routes
app.use(UploadService.router());
app.use(GoogleAuthService.middleware(AuthController.googleLogin))
app.use(ROUTES.API_BASE, apiLimiter , api_routes);
app.use(ROUTES.BASE, web_routes);

// Services
RoutesService.getRoutes(app);
ClientRouterService.init(app);

// Error Handling Middleware
app.use(errorHandler.e404);
app.use(errorHandler.e500);

app.listen(config.port, async () => {
  console.clear();

  if (config.setupDb) await DBService.connect();

  const address = config.isDev ? "http://localhost:" : "port ";

  RoutesService.log();
  logger.info(`Server is running on ${address}${config.port}`); //shows in console and saved in log file
});

module.exports = app;

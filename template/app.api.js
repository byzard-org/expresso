const config = require("./config");
require("./app/services").init(config);

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const api_routes = require("./app/routes/api");
const logger = require("./app/utils/logger");
const errorHandler = require("./app/middlewares/errorHandler");
const ROUTES = require("./app/routes/routes");
const cors = require("cors");

const UploadService = require("./app/services/upload");
const LangService = require("./app/services/lang");
const RoutesService = require("./app/services/routes");
const DBService = require("./app/services/db");
const Limiter = require("./app/middlewares/limiter");
const Utils = require("./app/utils");

const app = express();

const apiLimiter = Limiter({ maxLimit: 5, timeDelay: Utils.toMs({ s: 2 }) });// Limit users to 5 requests each 2s


app.use(cors());
app.use(cookieParser(config.jwtSecret));
app.use(bodyParser.json({ limit: config.parserJsonLimit }));
app.use(bodyParser.urlencoded({ extended: true, limit: config.parserLimit }));

app.use(LangService.tr);
app.use(RoutesService.router);

// Routes
app.use(UploadService.router());
app.use(ROUTES.API_BASE, apiLimiter, api_routes);

// Services
RoutesService.getRoutes(app);

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

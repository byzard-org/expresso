const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const process = require("process");

const generatorPath = path.join(__dirname, "generator");
const templatePath = path.join(__dirname, "template");

const notApiPaths = [
  "app/controllers/web",
  "app/controllers/client",
  "app/middlewares/web",
  "app/routes/web",
  "app/views",
  "public",
  "app/middlewares/errorHandler.js",
  "app.js",
  "app/routes/routes.js",
];

const apiPaths = [
  "app/middlewares/errorHandler.api.js",
  "app.api.js",
  "app/routes/routes.api.js",
];

const namesMap = {
  ".git.template": ".git",
  ".env.template": ".env",
  "errorHandler.api.js": "errorHandler.js",
  "app.api.js": "app.js",
  "routes.api.js": "routes.js",
};

function toFolderName(str = "") {
  return str
    .split(" ")
    .filter((v, i) => {
      return v.trim() != "";
    })
    .join("_")
    .split("_")
    .join("-");
}

function toLitt(str = "", capitalize = false) {
  const asPkg = str
    .split(" ")
    .filter((v, i) => {
      return v.trim() != "";
    })
    .join("-")
    .split("-")
    .join("_");

  var name = asPkg;
  var name_parts = name.split("_");
  name = name_parts
    .map((v, i) => {
      if (!capitalize && i == 0) return v;
      return v.charAt(0).toUpperCase() + v.slice(1);
    })
    .join("");

  return name;
}

function toUpper(str = "") {
  return str
    .split(" ")
    .filter((v, i) => {
      return v.trim() != "";
    })
    .join("-")
    .split("-")
    .join("_")
    .toUpperCase();
}

async function setVarsInFile(filePath, vars = {}) {
  var hasTargetExt = () => {
    for (let ext of [".js", ".html", ".json", ".env", ".md", ".ejs"])
      if (filePath.endsWith(ext)) return true;
    return false;
  };

  if (
    !hasTargetExt() ||
    !fs.existsSync(filePath) ||
    fs.statSync(filePath).isDirectory()
  )
    return;

  let content = await fs.readFile(filePath, "utf-8");
  for (let varName in vars) {
    if (!content.includes(`[##${varName}##]`)) continue;

    let value = vars[varName];
    content = content.split(`[##${varName}##]`).join(value);
  }
  await fs.writeFile(filePath, content);
}

async function createProject(projectName) {
  const projectPath = path.join(process.cwd(), projectName);
  var projectBasePath = projectName || "";
  if (!projectName) projectName = process.cwd().split(path.sep).pop();

  const PKG_NAME = projectName
    .split(" ")
    .filter((v, i) => {
      return v.trim() != "";
    })
    .join("-")
    .toLowerCase();

  var NAME = PKG_NAME;
  var parts = NAME.split("-").join("_").split("_");
  NAME = parts
    .map((v, i) => {
      return v.charAt(0).toUpperCase() + v.slice(1);
    })
    .join("");

  var prompt = await inquirer.prompt([
    {
      type: "confirm",
      name: "apiOnly",
      message: "Start project with API only ?",
      default: false,
    },
  ]);

  const IS_API_ONLY = prompt.apiOnly;

  function canCopyPath(path = "") {
    if (!IS_API_ONLY) return true;

    let templatePath = path.replaceAll("\\", "/");
    if (notApiPaths.includes(templatePath)) {
      return false;
    }

    for (let notApiPath of notApiPaths) {
      if (templatePath.startsWith(notApiPath)) {
        return false;
      }
    }
    return true;
  }

  async function copyPath(templateToCopy) {
    if (!canCopyPath(templateToCopy)) {
      fs.removeSync(path.join(projectPath, templateToCopy));
      return;
    }
    var templateName = templateToCopy;
    for (let nameToReplace in namesMap) {
      templateName = templateName.replaceAll(
        nameToReplace,
        namesMap[nameToReplace]
      );
    }

    await fs.copy(
      path.join(templatePath, templateToCopy),
      path.join(projectPath, templateName)
    );
    await setVarsInFile(path.join(projectPath, templateName), vars);
  }
  var defaultPort = parseInt(Math.random() * 50000 + 3000);
  defaultPort += Date.now()
    .toString()
    .split("")
    .reduce((a, b) => parseInt(a) + parseInt(b));

  var configure_db = await inquirer.prompt([
    {
      type: "number",
      name: "port",
      message: "Enter port number for the server:",
      default: defaultPort,
    },
    {
      type: "confirm",
      name: "setup_db",
      message: "Do you want to configure database? :",
      default: true,
    },
  ]);

  var PORT = configure_db.port;
  var SETUP_DB = configure_db.setup_db;
  var DBNAME = "";
  var DBUSER = "";
  var DBPASSWORD = "";
  var DBHOST = "127.0.0.1";
  var DBPORT = "27017";

  if (SETUP_DB) {
    var db_details = await inquirer.prompt([
      {
        type: "input",
        name: "DBNAME",
        message: "Enter database name:",
        default: NAME.toLowerCase() + "_db",
        validate: function (input) {
          if (input.trim() == "") {
            return "Database name cannot be empty";
          }
          if (input.includes(" ")) {
            return "Database name cannot contain spaces";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "DBUSER",
        message: "Enter database user:",
        validate: function (input) {
          if (input.includes(" ")) {
            return "Database user cannot contain spaces";
          }
          return true;
        },
      },
      {
        type: "input",
        name: "DBPASSWORD",
        message: "Enter database password:",
      },
      {
        type: "input",
        name: "DBHOST",
        message: "Enter database host:",
        default: DBHOST,
      },
      {
        type: "number",
        name: "DBPORT",
        message: "Enter database port:",
        default: DBPORT,
      },
    ]);

    DBNAME = db_details.DBNAME;
    DBUSER = db_details.DBUSER;
    DBPASSWORD = db_details.DBPASSWORD;
    DBHOST = db_details.DBHOST;
    DBPORT = db_details.DBPORT;
  }

  const vars = {
    PKG_NAME: PKG_NAME,
    NAME: NAME,
    PORT: PORT,
    SETUP_DB: SETUP_DB,
    DBHOST: DBHOST,
    DBPORT: DBPORT,
    DBNAME: DBNAME,
    DBUSER: DBUSER,
    DBPASSWORD: DBPASSWORD,
  };

  try {
    await fs.ensureDir(projectPath);
    const templatesToCopy = await fs.readdir(templatePath, {
      recursive: true,
    });
    for (let templateToCopy of templatesToCopy) {
      await copyPath(templateToCopy);
    }
    for (let templateToCopy of apiPaths) {
      if (IS_API_ONLY) await copyPath(templateToCopy);
      fs.removeSync(path.join(projectPath, templateToCopy));
    }
    console.clear();
    console.log(`Created project at ${projectPath}`);
    generateJWT(projectBasePath);
    console.log("Now you can run :");
    console.log(`↪ cd ${projectName}`);
    console.log("↪ npm install");
    console.log("↪ npm run dev");
  } catch (err) {
    console.error("Error creating project:", err);
  }
}

function promptProject(projectName) {
  if (!projectName) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "projectName",
          message: `Enter project name (default: ${process
            .cwd()
            .split(path.sep)
            .pop()}):`,
        },
      ])
      .then((answers) => {
        projectName = answers.projectName;
        createProject(projectName);
      });
  } else createProject(projectName);
}

function generateJWT(projectFolder = "") {
  if (typeof projectFolder !== "string") projectFolder = "";
  const envPath = path.join(process.cwd(), projectFolder, ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found");
    return;
  }

  var content = fs.readFileSync(envPath, "utf-8");
  var lines = content.split("\n");
  var found = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("JWT_SECRET")) {
      found = i;
      break;
    }
  }

  if (found == -1) {
    fs.appendFileSync(
      envPath,
      `\n\nJWT_SECRET = ${require("crypto").randomBytes(64).toString("hex")}`
    );
    return;
  }

  lines[found] = `JWT_SECRET = ${require("crypto")
    .randomBytes(64)
    .toString("hex")}`;
  content = lines.join("\n");
  fs.writeFileSync(envPath, content);
  console.log("Genereated a new JWT secret 🔒");
}
function setEnvKey(key, value) {
  if (!value) value = "";
  key = key.toUpperCase();
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found");
    return;
  }

  var content = fs.readFileSync(envPath, "utf-8");
  var lines = content.split("\n");
  var found = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`${key}`)) {
      found = i;
      break;
    }
  }

  if (found == -1) {
    fs.appendFileSync(envPath, `\n${key} = ${value}`);
    return;
  }

  lines[found] = `${key} = ${value}`;
  content = lines.join("\n");
  fs.writeFileSync(envPath, content);
}
function getEnvKey(key) {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found");
    return;
  }
  var content = fs.readFileSync(envPath, "utf-8");
  var lines = content.split("\n");

  var obj = {};

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() == "" || lines[i].startsWith("#")) continue;
    obj[lines[i].split("=")[0].trim().toUpperCase()] = lines[i]
      .split("=")[1]
      ?.trim();
  }
  if (typeof key == "object") key = null;
  console.log(key ? obj[key.toUpperCase()] ?? "Key not found" : obj);
}
function deleteEnvKey(key) {
  key = key.toUpperCase();
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env file not found");
    return;
  }

  var content = fs.readFileSync(envPath, "utf-8");
  var lines = content.split("\n");
  var found = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`${key}`)) {
      found = i;
      break;
    }
  }

  if (found == -1) {
    console.error("Key not found");
    return;
  }

  lines.splice(found, 1);
  content = lines.join("\n");
  fs.writeFileSync(envPath, content);
}

async function generateMiddleware(middlewareName) {
  middlewareName += " middleware";
  middlewareName = toLitt(middlewareName);

  var prompt = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Select middleware type:",
      choices: ["API", "Web"],
    },
  ]);

  var middlewareType = prompt.type.toLowerCase();

  const middlewarePath = path.join(
    process.cwd(),
    "app",
    "middlewares",
    middlewareType,
    `${middlewareName}.js`
  );

  if (fs.existsSync(middlewarePath)) {
    var prompt = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Middleware " + middlewareName + " already exists, overwrite?",
        default: false,
      },
    ]);

    if (!prompt.overwrite) return;
  }

  const middlewareTemplatePath = path.join(generatorPath, "middleware.js");
  await fs.copy(middlewareTemplatePath, middlewarePath);
  await setVarsInFile(middlewarePath, {
    MIDDLEWARE_NAME: toLitt(middlewareName, true),
  });

  console.log(
    "Generated",
    path.join("app", "middlewares", middlewareType, middlewareName + ".js")
  );
}

async function generateController(controllerName) {
  controllerName += " controller";
  controllerName = toLitt(controllerName);

  var prompt = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Select controller type:",
      choices: ["API", "Web"],
    },
  ]);

  var controllerType = prompt.type.toLowerCase();

  const controllerPath = path.join(
    process.cwd(),
    "app",
    "controllers",
    controllerType,
    `${controllerName}.js`
  );

  var suffix = controllerType == "api" ? "Api" : "";

  if (fs.existsSync(controllerPath)) {
    var prompt = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Controller " + suffix + controllerName + " already exists, overwrite?",
        default: false,
      },
    ]);

    if (!prompt.overwrite) return;
  }

  const controllerTemplatePath = path.join(generatorPath, "controller.js");
  await fs.copy(controllerTemplatePath, controllerPath);
  await setVarsInFile(controllerPath, {
    CONTROLLER_NAME: suffix + toLitt(controllerName, true),
  });

  console.log(
    "Generated",
    path.join("app", "controllers", controllerType, controllerName + ".js")
  );
}

async function generateModel(modelName) {
  const modelPath = path.join(
    process.cwd(),
    "app",
    "models",
    `${toLitt(modelName + " model")}.js`
  );

  if (fs.existsSync(modelPath)) {
    var prompt = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message:
          "Model " +
          toLitt(modelName + " model") +
          " already exists, overwrite?",
        default: false,
      },
    ]);

    if (!prompt.overwrite) return;
  }

  const modelTemplatePath = path.join(generatorPath, "model.js");
  await fs.copy(modelTemplatePath, modelPath);
  await setVarsInFile(modelPath, {
    MODEL_NAME: toLitt(modelName),
    MODEL_NAME_U: toLitt(modelName, true),
  });

  console.log(
    "Generated",
    path.join("app", "models", `${toLitt(modelName + " model")}.js`)
  );
}

async function generateView(viewName) {
  const viewPath = path.join(
    process.cwd(),
    "app",
    "views",
    `${toLitt(viewName)}.ejs`
  );

  if (fs.existsSync(viewPath)) {
    var prompt = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "View " + toLitt(viewName) + " already exists, overwrite?",
        default: false,
      },
    ]);

    if (!prompt.overwrite) return;
  }

  const viewTemplatePath = path.join(generatorPath, "view.ejs");
  await fs.copy(viewTemplatePath, viewPath);
  await setVarsInFile(viewPath, {
    VIEW_NAME: toLitt(viewName, true)
      .replaceAll("\\", " ")
      .replaceAll("/", " "),
  });

  console.log(
    "Generated",
    path.join("app", "views", `${toLitt(viewName)}.ejs`)
  );
}

async function generateService(serviceName) {
  const servicePath = path.join(
    process.cwd(),
    "services",
    `${toFolderName(serviceName)}`,
    "index.js"
  );
  const className = toLitt(serviceName, true);

  if (fs.existsSync(servicePath)) {
    var prompt = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "Service " + className + " already exists, overwrite?",
        default: false,
      },
    ]);

    if (!prompt.overwrite) return;
  }

  const serviceTemplatePath = path.join(generatorPath, "service.js");
  await fs.copy(serviceTemplatePath, servicePath);
  await setVarsInFile(servicePath, {
    SERVICE_NAME: className,
  });

  console.log(
    "Generated",
    path.join("app", "services", `${toFolderName(serviceName)}`, "index.js")
  );
}

async function generateRoute(routeName) {
  const routesPath = path.join(process.cwd(), "app", "routes", "routes.js");
  const key = toUpper(routeName);
  if (!routeName.startsWith("/")) routeName = "/" + routeName;

  const routes = { [key]: routeName };
  Object.assign(routes, require(routesPath));

  var routesStr = "";
  Object.keys(routes).forEach(
    (k) => (routesStr += `  ${k} : "${routes[k]}",\n`)
  );
  fs.writeFileSync(
    routesPath,
    `const ROUTES = {
${routesStr}}

module.exports = ROUTES;
`,
    { encoding: "utf-8" }
  );
}

async function generate() {
  const choices = {
    mvc: "Model-View-Controller",
    mdl: "Model",
    vw: "View",
    ctr: "Controller",
    jwt: "JWT Secret Key",
    rte: "Route",
    mdw: "Middleware",
    svc: "Service",
  };
  const choice = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "What do you want to generate ?",
      choices: Object.values(choices),
    },
  ]);

  switch (choice.type) {
    case choices.ctr:
      var controllerName = await inquirer.prompt([
        {
          type: "input",
          name: "controllerName",
          message: "Enter controller name:",
          validate: function (input) {
            if (input.trim() == "") {
              return "Controller name cannot be empty";
            }
            return true;
          },
        },
      ]);

      generateController(controllerName.controllerName);
      break;
    case choices.jwt:
      generateJWT();
      break;
    case choices.mdl:
      var modelName = await inquirer.prompt([
        {
          type: "input",
          name: "modelName",
          message: "Enter model name:",
          validate: function (input) {
            if (input.trim() == "") {
              return "Model name cannot be empty";
            }
            return true;
          },
        },
      ]);

      generateModel(modelName.modelName);
      break;

    case choices.svc:
      var serviceName = await inquirer.prompt([
        {
          type: "input",
          name: "serviceName",
          message: "Enter service name:",
          validate: function (input) {
            if (input.trim() == "") {
              return "Service name cannot be empty";
            }
            return true;
          },
        },
      ]);

      generateService(serviceName.serviceName);
      break;

    case choices.vw:
      var viewName = await inquirer.prompt([
        {
          type: "input",
          name: "viewName",
          message: "Enter view name:",
          validate: function (input) {
            if (input.trim() == "") {
              return "View name cannot be empty";
            }
            return true;
          },
        },
      ]);

      generateView(viewName.viewName);
      break;

    case choices.mdw:
      var middlewareName = await inquirer.prompt([
        {
          type: "input",
          name: "middlewareName",
          message: "Enter middleware name:",
          validate: function (input) {
            if (input.trim() == "") {
              return "Middleware name cannot be empty";
            }
            return true;
          },
        },
      ]);

      generateMiddleware(middlewareName.middlewareName);
      break;

    case choices.mvc:
      var name = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Enter MVC name:",
          validate: function (input) {
            if (input.trim() == "") {
              return "MVC name cannot be empty";
            }
            return true;
          },
        },
      ]);

      await generateMVC(name.name);
      break;

    default:
      break;
  }
}

async function generateMVC(name) {
  await generateModel(name);
  await generateView(name);
  await generateController(name);
}

async function showDBMenu() {
  const choices = {
    seed: "Seed to database",
    serve: "Serve a read-only database dashboard ",
  };
  const choice = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What do you want to do ?",
      choices: Object.values(choices),
    },
  ]);

  switch (choice.action) {
    case choices.seed:
      var params = await inquirer.prompt([
        {
          type: "confirm",
          name: "erase",
          message: "Clear existing documents before seeding ?",
          default: false,
        },
        {
          type: "input",
          name: "only",
          message:
            "Collections or files to include in the seed (default to all):",
        },
        {
          type: "input",
          name: "exclude",
          message:
            "Collections or files to ignore during the seed (default to none):",
        },
      ]);

      seedDb(params);
      break;

    case choices.serve:
      var params = await inquirer.prompt([
        {
          type: "number",
          name: "port",
          message: "Enter port number for the dashboard server:",
          default: 9484,
        },
      ]);
      serveDB(params.port);
      break;

    default:
      break;
  }
}
async function seedDb(params) {
  var { erase, only, exclude } = params;
  const parsedOnly = [];
  if (typeof only === "string") only = only.split(" ");
  for (let o of only) {
    parsedOnly.push(
      ...o
        .split(" ")
        .join(",")
        .split(",")
        .filter((v) => v.trim() != "")
    );
  }

  const parsedExclude = [];
  if (typeof exclude === "string") exclude = exclude.split(" ");
  for (let o of exclude) {
    parsedExclude.push(
      ...o
        .split(" ")
        .join(",")
        .split(",")
        .filter((v) => v.trim() != "")
    );
  }

  requireDBModels();

  const service = require(path.join(process.cwd(), "app", "services/db"));
  service
    ._seed({ only: parsedOnly, exclude: parsedExclude, erase })
    .then(() => {
      process.exit(1);
    });
}

function requireDBModels() {
  const modelsPath = path.join(process.cwd(), "app", "models");
  const models = fs.readdirSync(modelsPath);
  for (let modelFile of models) {
    const modelPath = path.join(modelsPath, modelFile);
    require(modelPath);
  }
}

async function serveDB(port = 9484) {
  if (isNaN(parseInt(port))) {
    console.log("Port is not valid.");
    return;
  }
  port = parseInt(port);
  requireDBModels();

  const service = require(path.join(process.cwd(), "app", "services/db"));
  console.log("Starting dashboard server on port", port);

  const express = require("express");
  const app = express();

  app.use(express.static(path.join(__dirname, "dashboard_serve", "public")));
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "dashboard_serve", "views"));

  app.get("/", async (req, res) => {
    const data = await service._getCollections();
    res.render("index", { data });
  });
  app.get("/docs/:id", async (req, res) => {
    const data = await service._getCollectionData(req.params.id);
    res.render("docs", { data });
  });

  app.get("/api", async (req, res) => {
    const data = await service._getCollections();
    res.json(data);
  });

  app.get("/api/docs/:id", async (req, res) => {
    const data = await service._getCollectionData(req.params.id);
    res.json(data);
  });

  app.listen(port, () => {
    console.log("Dashboard server on http://localhost:" + port);
  });
  // process.exit(1);
}

module.exports = {
  toLitt,
  setVarsInFile,
  promptProject,
  generateJWT,
  setEnvKey,
  getEnvKey,
  deleteEnvKey,
  seedDb,
  serveDB,
  showDBMenu,
  generateView,
  generateService,
  generateController,
  generateMiddleware,
  generateMVC,
  generateModel,
  generateRoute,
  generate,
};

#!/usr/bin/env node

const { program } = require("commander");
var pjson = require("./package.json");

const {
  promptProject,
  generateJWT,
  generateController,
  generateModel,
  generateView,
  getEnvKey,
  setEnvKey,
  deleteEnvKey,
  generate,
  generateMVC,
  generateMiddleware,
  generateService,
  generateRoute,
  seedDb,
  showDBMenu,
  serveDB,
} = require("./utils");

program
  .version(pjson.version)
  .description(pjson.description)
  .name("expresso");

program
  .command("new [project-name]")
  .description("Create a new project")
  .action(promptProject);

program.command("env").description("Get all env keys").action(getEnvKey);

program
  .command("env:get <key>")
  .description("Get a env key value")
  .action(getEnvKey);

program
  .command("env:set <key> [value]")
  .description("Generate a env key value pair")
  .action(setEnvKey);

program
  .command("env:delete <key>")
  .description("Delete a env key value")
  .action(deleteEnvKey);

program
  .command("generate")
  .description("Global generate command")
  .action(generate);

program
  .command("generate:jwt")
  .description("Generate a JWT secret key")
  .action(generateJWT);

program
  .command("generate:mvc <name>")
  .description("Generate a Model-View-Controller")
  .action(generateMVC);

program
  .command("generate:model <model-name>")
  .description("Generate a model")
  .action(generateModel);

program
  .command("generate:view <view-name>")
  .description("Generate a view")
  .action(generateView);

program
  .command("generate:controller <controller-name>")
  .description("Generate a controller")
  .action(generateController);

program
  .command("generate:service <service-name>")
  .description("Generate a service")
  .action(generateService);

program
  .command("generate:middleware <middleware-name>")
  .description("Generate a middleware")
  .action(generateMiddleware);

program
  .command("generate:route <route-name>")
  .description("Generate a route")
  .action(generateRoute);

program
  .command("db")
  .description("Excute an action on database")
  .action(showDBMenu);

program
  .command("db:seed")
  .option(
    "-e, --erase",
    "Whether to clear existing documents in the collections before seeding",
    false
  )
  .option(
    "-o, --only <collections...>",
    "Collections or files that should be used in the seed",
    []
  )
  .option(
    "-ex, --exclude <collections...>",
    "Collections or files that should not be ignored in the seed. Can overide the 'only' option.",
    []
  )
  .description("Seed data to db")
  .action(seedDb);

program
  .command("db:serve [port]")
  .description("Create a read-only dashboard server to database")
  .action(serveDB);

program.parse(process.argv);

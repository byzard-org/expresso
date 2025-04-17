const fs = require("fs");
const path = require("path");

const global = require("./app/views/global");
const config = require("./config");

function collectClasses(obj = {}) {
  const classes = [];

  for (const key in obj) {
    if (typeof obj[key] === "string") {
      classes.push(obj[key]);
    } else if (typeof obj[key] === "object") {
      classes.push(...collectClasses(obj[key]));
    } else if (typeof obj[key] === "function") {
      try {
        classes.push(obj[key]);
      } catch (e) {}
    }
  }

  const descriptors = Object.getOwnPropertyDescriptors(obj);
  for (const key in descriptors) {
    if (typeof descriptors[key].get === "function") {
      try {
        classes.push(descriptors[key].get.call(obj));
      } catch (e) {}
    }
  }

  return classes;
}

(function () {
  if (!config.isDev) return;
  
  const allClasses = collectClasses(global.class);

  const uniqueClasses = [...new Set(allClasses.join(" ").split(/\s+/))];

  const htmlContent = `<div class="${uniqueClasses.join(" ")}"></div>`;

  const outputPath = path.join(__dirname, "generated", "global.html");
  if (fs.readFileSync(outputPath, "utf8") != htmlContent)
    fs.writeFileSync(path.join(__dirname, "generated", "global.html"), htmlContent);
})();

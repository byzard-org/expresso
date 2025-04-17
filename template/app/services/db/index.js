const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Utils = require("../../utils");
const config = require("../../../config");
const process = require("process");

/**
 * Database Service for managing MongoDB connections, seeding, and collection data retrieval.
 */
class DBService {
  /**
   * Connects the application to MongoDB.
   *
   * @param {boolean} [showConnectionState=true] - Whether to display connection state logs in the console.
   * @returns {Promise<void>}
   */
  static async connect(showConnectionState = true) {
    if (!config.dbUri) return;

    if (showConnectionState) {
      mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
      });
    }

    try {
      if (showConnectionState)
        console.log(`Connecting to MongoDB (${config.dbUri})`);
      await mongoose.connect(config.dbUri, {});
    } catch (err) {
      console.error("Error connecting to MongoDB: ", err.message);
      process.exit(1);
    }
  }

  /**
   * Seeds MongoDB collections with data from JSON files.
   *
   * @param {Object} [options={}] - Configuration options for seeding.
   * @param {string[]} [options.only=[]] - Specific seed files or collection names to process.
   * @param {string[]} [options.exclude=[]] - Seed files or collection names to exclude.
   * @param {boolean} [options.erase=true] - Whether to clear existing documents in the collections before seeding.
   * @returns {Promise<void>}
   * @private
   */
  static async _seed({ only = [], exclude = [], erase = true } = {}) {
    await this.connect(false);

    const seedersDir = path.resolve(__dirname, "../../seeders");
    const seedsDir = path.resolve(__dirname, "../../../seeds");

    for (let dir of [seedersDir, seedsDir])
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    const seedLog = {};

    let files = fs
      .readdirSync(seedersDir)
      .filter((file) => file.endsWith(".json"));

    if (only.length > 0) {
      files = files.filter((file) => {
        const name = path.basename(file, ".json");
        return only.includes(file) || only.includes(name);
      });
    }

    if (exclude.length > 0) {
      files = files.filter((file) => {
        const name = path.basename(file, ".json");
        return !(exclude.includes(file) || exclude.includes(name));
      });
    }

    for (const file of files) {
      const collectionName = path.basename(file, ".json");
      const filePath = path.join(seedersDir, file);

      let data;
      try {
        data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch (error) {
        data = [];
      }

      try {
        const stringData = Utils._string(collectionName);
        function alternativesStringData(data) {
          const alternatives = [data._value, data.singularize()._value];
          if (!data._value.endsWith("s")) {
            alternatives.push(data.pluralize()._value);
          }
          return alternatives;
        }

        const possibleModelNames = [
          ...alternativesStringData(stringData),
          ...alternativesStringData(stringData.capitalize()),
        ];

        let Model;

        for (let possibleName of possibleModelNames) {
          try {
            Model = mongoose.model(possibleName);
          } catch (_) {}
        }

        if (erase) await Model.deleteMany();
        const result = await Model.create(data);

        seedLog[Model.collection.collectionName] = data;

        console.log(
          `✅ ${result.length} docs added to ${Model.collection.collectionName}`
        );
      } catch (error) {
        console.error(
          `❌ Error when inserting docs to ${collectionName}:`,
          error.message
        );
      }
    }

    if (Object.keys(seedLog).length === 0) {
      console.log("No seed created.");
      return;
    }

    const logFileName = `${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.seed.json`;
    fs.writeFileSync(
      path.join(seedsDir, logFileName),
      JSON.stringify(seedLog, null, 2),
      "utf-8"
    );

    console.log(`📂 Seed log in ${path.join("seeds", logFileName)}`);
  }

  /**
   * Retrieves metadata of all MongoDB collections.
   *
   * @returns {Promise<Object[]>} - A list of objects containing collection metadata.
   * Each object contains:
   *  - `name` (string): The name of the collection.
   *  - `model` (string): The name of the associated Mongoose model.
   *  - `count` (number): The number of documents in the collection.
   * @private
   */
  static async _getCollections() {
    await this.connect(false);
    const db_collections = mongoose.connection.collections;
    const promise_collections = Object.keys(db_collections).map(async (k) => {
      const collection = db_collections[k];
      const name = collection.name;
      const model = collection.modelName;
      const count = await mongoose.model(model).countDocuments();

      return {
        name,
        model,
        count,
      };
    });
    const collections = await Promise.all(promise_collections);
    return collections;
  }

  /**
   * Retrieves all documents from a specific MongoDB collection.
   *
   * @param {string} id - The name of the collection to retrieve data from.
   * @returns {Promise<Object|null>} - An object containing:
   *  - `name` (string): The name of the collection.
   *  - `model` (string): The name of the associated Mongoose model.
   *  - `docs` (Array): An array of documents from the collection.
   * Returns `null` if the collection does not exist.
   * @private
   */
  static async _getCollectionData(id) {
    await this.connect(false);
    const db_collections = mongoose.connection.collections;
    const collection = db_collections[id];
    if (!collection) return null;

    const name = collection.name;
    const model = collection.modelName;
    const docs = await mongoose.model(model).find();

    return {
      name,
      model,
      docs,
    };
  }
}

module.exports = DBService;

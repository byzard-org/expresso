class [##CONTROLLER_NAME##] {
  static async index(req, res, next) {
    try {
      return res
        .status(200)
        .json({ message: "Hello from [##CONTROLLER_NAME##] !" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = [##CONTROLLER_NAME##];

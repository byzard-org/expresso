const mongoose = require("mongoose");

const [##MODEL_NAME##]Schema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique:true,
  },
} ,{
  timestamps: true, 
});

[##MODEL_NAME##]Schema.pre("save", function (next) {
  next();
});

const [##MODEL_NAME_U##] = mongoose.model("[##MODEL_NAME##]", [##MODEL_NAME##]Schema);

module.exports = [##MODEL_NAME_U##];

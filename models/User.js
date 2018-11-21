const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

const ModelClass = mongoose.model("User", userSchema);

module.exports = ModelClass;

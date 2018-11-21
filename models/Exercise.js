const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Below is the Exercise Schema. Any given User may have many Exercise objects
// which are connected to that User via their userId, which corresponds to the
// User's _id property

const exerciseSchema = new Schema(
  {
    username: { type: String, required: true},
    userId: {type: Number, required: true },
    description: {type: String, required: true},
    duration: {type: Number, required: true },
    date: {type: Date, required: true }
  },
  { timestamps: true }
);

const ModelClass = mongoose.model("Exercise", exerciseSchema);

module.exports = ModelClass;

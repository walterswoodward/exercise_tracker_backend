const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true},
  description: String,
  duration: Number,
  date: Date
  // _id is automatically included
}, {timestamps: true});

const ModelClass = mongoose.model('User', userSchema)

module.exports = ModelClass; 

// TEMPLATE:
// {
//   username: "Alejahd",
//   description: "Eat Fatty Foods",
//   duration: 60,
//   _id: "BJ67nLMAm",
//   date: "Tue Mar 19 2019"
//   }
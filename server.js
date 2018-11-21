// CORE
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // remove in prod
const User = require("./models/User");

// .use()
server.use(express.json());
server.use(cors());

// CONNECT to DATABASE
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
);

// TESTER GET
server.get("/", (req, res) => {
  res.json({ api: "exercise tracker server up and running" });
});

// View All Users
server.get("/api/users/", (req, res) => {
  User.find()
    .populate()
    .then(users => {
      if (users.length === 0) {
        res.status(404).json({ error: "No users found!" });
      } else {
        res.status(200).json(users);
      }
    })
    .catch(error => res.status(500).json(error));
});

// Create New User
server.post("/api/exercise/new-user/", (req, res) => {
  const data = req.body;
  User.create(data)
    .then(data => res.status(201).json({ data }))
    .catch(error => res.status(500).json({ error }));
});

// Update User with Additional Data
server.put("/api/exercise/add/", (req, res, done) => {
  const data = req.body;
  User.findOneAndUpdate(
    { _id: data._id },
    {
        description: data.description,
        duration: data.duration,
        date: data.date
    },
    { new: true },
    (err, data) => {
      if (err) {
        res.status(500).json({ error })
      }
      res.status(201).json(data)
    }
  )
});

// Listen to see if everything is working
server.listen(process.env.PORT || 5000, function() {});

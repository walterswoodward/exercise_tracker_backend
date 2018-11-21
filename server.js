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

// INTIAL TESTER GET
server.get("/", (req, res) => {
  res.json({ api: "exercise tracker server up and running" });
});

// Log All Users
// Ex. http://localhost:5000/api/exercise/log?id=5bf4e9f848cbb2a630259995&limit=1&from=2019-09-09&duration=10&to=2019-09-09
server.get("/api/exercise/log", (req, res) => {
  const id = req.query.id;
  const from = req.query.from;
  const to = req.query.to;
  const limit = parseInt(req.query.limit);
  // console.log(`{id: ${id}, from: ${from}, to: ${to}, limit: ${limit}}`);

  let query = User.find();

  // Test: http://localhost:5000/api/exercise/log?from=1987-09-09
  if (from) {
    query.where("date").gte(from);
  }
  // Test: http://localhost:5000/api/exercise/log?to=2018-09-09
  if (to) {
    query.where("date").lte(to);
  }

  query
    // Didn't run into the same issues with limit() as with lte() and gte(). If
    // no value for limit is passed, then limit() doesn't seem to query while
    // gte() and lte() do ... temporary solution was to create the above if
    // conditionals. TODO: Figure out why the difference?
    .limit(limit)
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
    .then(data => res.status(201).json(data))
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
    { runValidators: true },
    (err, data) => {
      if (err) {
        res.status(500).json({ error });
      }
      res.status(201).json(data);
    }
  );
});

// Log One User by Id
server.get("/api/exercise/log/:id", (req, res) => {
  const personId = req.params.id;
  User.findById(personId)
    .populate()
    .then(response => {
      res.json(response);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Listen to see if everything is working
server.listen(process.env.PORT || 5000, function() {});

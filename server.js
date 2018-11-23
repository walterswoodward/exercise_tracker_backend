// CORE
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
// require("dotenv").config(); // remove in prod
const User = require("./models/User");
const Exercise = require("./models/Exercise");

// .use()
server.use(express.json());
server.use(cors());

// CONNECT to DATABASE
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true }
);

// INTIAL TESTER GET
server.get("/", (req, res) => {
  res.json({ api: "exercise tracker server up and running" });
});

// Create New User
server.post("/api/exercise/new-user/", (req, res) => {
  console.log(req.body);
  const data = req.body;
  User.create(data)
    .then(data => {
      res.status(201).json(data);
    })
    .catch(error => res.status(500).json({ error }));
});

// Create Exercise
server.post("/api/exercise/new-exercise/", (req, res) => {
  console.log(req.body);
  const data = req.body;
  Exercise.create({
    username: data.username,
    userId: data.userId,
    description: data.description,
    duration: data.duration,
    date: new Date(data.date)
  })
    .then(data => res.status(201).json(data))
    .catch(error => res.status(500).json({ error }));
});

// Show Users
server.get("/api/exercise/users", (req, res) => {
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

// Show Exercises
// TEST: https://exercise-tracker-backend.herokuapp.com/api/exercise/logs/
server.get("/api/exercise/logs/", (req, res) => {
  Exercise.find()
    .populate()
    .then(exercises => {
      if (exercises.length === 0) {
        res.status(404).json({ error: "No exercises found!" });
      } else {
        console.log("/api/exercise/logs/");
        res.status(200).json(exercises);
      }
    })
    .catch(error => res.status(500).json(error));
});

// Query One Exercise Log
// To select specific User:
// TEST: https://exercise-tracker-backend.herokuapp.com/api/exercise/log?userId=5bf7a334e52b0900047f60ec
// To simply return all logs:
// TEST: https://exercise-tracker-backend.herokuapp.com/api/exercise/log/
// To set limit:
// TEST: https://exercise-tracker-backend.herokuapp.com/api/exercise/log?userId=5bf7a334e52b0900047f60ec&limit=1
// To set `to` and `from`
https://exercise-tracker-backend.herokuapp.com/api/exercise/log?userId=5bf7a334e52b0900047f60ec&from=2018-09-09&to=2018-11-23

server.get("/api/exercise/log/", (req, res) => {
  const userId = req.query.userId;
  const from = new Date(req.query.from);
  const to = new Date(req.query.to);
  const limit = Number(req.query.limit);
  // const queryArr = [userId, from, to, limit];
  // console.log(`{userId: ${userId}, from: ${from}, to: ${to}, limit: ${limit}}`);
  let query = Exercise.find({ userId: userId });

  // Test: https://exercise-tracker-backend.herokuapp.com/api/exercise/log?from=1987-09-09
  if (from) {
    query.where("date").gte(from);
  }
  // Test: https://exercise-tracker-backend.herokuapp.com/api/exercise/log?to=2018-09-09
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
    .then(exercises => {
      if (exercises.length === 0) {
        res.status(404).json({ error: "No exercises found!" });
      } else {
        res.status(200).json(exercises);
      }
    })
    .catch(error => res.status(500).json(error));
});

// Show One User
server.get("/api/exercise/users/:id", (req, res) => {
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

// Show One Exercise
server.get("/api/exercise/logs/:id", (req, res) => {
  const exerciseId = req.params.id;
  Exercise.findById(exerciseId)
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

// CORE
const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // remove in prod
server.use(express.json());
server.use(cors());

// CONNECT to DATABASE
mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true }
)

// TESTER GET
server.get('/', (req, res)=>{
  res.json({api: "exercise tracker server up and running"})
})

// Listen to see if everything is working
server.listen(process.env.PORT || 5000, function(){
  
});

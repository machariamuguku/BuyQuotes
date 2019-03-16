//Needless to say, this connects to mongoDB Atlas servers

const mongoose = require("mongoose");
require('dotenv').config();
const log4jslogger = require("./log4js");

/*
  add moongose and connect to db
  Try local connection first before connecting to the online DB
*/

// let mongoport = 27017; //mongo port for local connection
// let mongourl = "mongodb://localhost:"+mongoport+"/buyquotes" || The_ONLINE_MongoDB_Atlas_ConnectionURL_HERE;

/*
  N/B change characters reserved for URL's in conection string password
  with their respective encoding 
  eg encoding the '#' with %23 and '@' with %40 
*/
//MOngo Atlas
// let mongourl = The_ONLINE_MongoDB_Atlas_ConnectionURL_HERE;

//You can also use Mongo Clever Cloud

let mongourl = "The_ONLINE_MongoDB_Atlas_ConnectionURL_HERE";
mongoose
  .connect(mongourl, {
    useNewUrlParser: true
  })
  .then(
    () => {
      console.log("The Database connection is successful");
      log4jslogger.info("#Mongo-200 .... The Database connection is successful");
    },
    err => {
      console.log("Error when connecting to the database " + err);
      log4jslogger.info("#Mongo-400 .... Error when connecting to the database " + err);
    }
  );
//set moongoose connection
let moongoseconn = mongoose.connection;

module.exports = moongoseconn;
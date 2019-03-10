// const mongoose = require("mongoose");
require('dotenv').config();
let MongoClient = require('mongodb').MongoClient,
  assert = require('assert');

/*
  add moongose and connect to db
  Try local connection first before connecting to the online DB
*/

// let mongoport = 27017; //mongo port for local connection
// let mongourl = "mongodb://localhost:"+mongoport+"/buyquotes" || process.env.MongoDBAtlasConnectionURL;

/*
  N/B change characters reserved for URL's in conection string password
  with their respective encoding 
  eg # with %23 and @ with %40 
*/
//MOngo Atlas
// let mongourl = process.env.MongoDBAtlasConnectionURL;

//Mongo Clever Cloud

//old

// let mongourl = process.env.MongoDBCleverCloudConnectionURL;
// mongoose
//   .connect(mongourl, {
//     useNewUrlParser: true
//   })
//   .then(
//     () => {
//       console.log("The Database connection is successful");
//     },
//     err => {
//       console.log("Error when connecting to the database " + err);
//     }
//   );
// //set moongoose connection
// let moongoseconn = mongoose.connection;

// module.exports = moongoseconn;


// Connection URL
let url = process.env.MongoDBCleverCloudConnectionURL;

// Use connect method to connect to the server
module.exports.moongoseconn = MongoClient.connect(url, function (err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
});
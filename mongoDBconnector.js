// const mongoose = require("mongoose");
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

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

const uri = process.env.MongoDBCleverCloudConnectionURL;
const client = new MongoClient(uri, {
  useNewUrlParser: true
});
let moongoseconn = client.connect(err => {
  const collection = client.db("buyQuotes").collection("QuotesCollection");
  // perform actions on the collection object
  client.close();
});

module.exports = moongoseconn;
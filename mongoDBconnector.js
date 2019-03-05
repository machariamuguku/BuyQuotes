const mongoose = require("mongoose");

/*
  add moongose and connect to db
  Try local connection first before connecting to the online DB
*/

// let mongoport = 27017; //mongo port for local connection
// let mongourl = "mongodb://localhost:" + mongoport + "/buyquotes" || 'mongodb+srv://muguku:%40chiever%231@buyquotes-ddg7d.mongodb.net/test?retryWrites=true';

/*
  N/B change characters reserved for URL's in conection string password
  with their respective encoding 
  eg # with %23 and @ with %40 
*/
let mongourl = "mongodb+srv://muguku:%40chiever%231@buyquotes-ddg7d.mongodb.net/buyquotes?retryWrites=true";
mongoose
  .connect(mongourl, {
    useNewUrlParser: true
  })
  .then(
    () => {
      console.log("The Database connection is successful");
    },
    err => {
      console.log("Error when connecting to the database " + err);
    }
  );
//set moongoose connection
let moongoseconn = mongoose.connection;

module.exports = moongoseconn;
const express = require("express");
const prettyjson = require("prettyjson");
const request = require("request");
const moment = require("moment");
const base64 = require("base-64");
const log4jslogger = require('./log4js');
const mongoose = require('mongoose');


// add moongose and connect to db
//Try local connection first before connecting to the online DB
let mongoport = 27017;

/* N/B change characters reserved for uri in conection string 
with their respective encoding 
eg # with %23 and @ with %40 */
// let mongourl = "mongodb://localhost:" + mongoport + "/buyquotes" || 'mongodb+srv://muguku:%40chiever%231@buyquotes-ddg7d.mongodb.net/test?retryWrites=true';
let mongourl = 'mongodb+srv://muguku:%40chiever%231@buyquotes-ddg7d.mongodb.net/buyquotes?retryWrites=true';
mongoose.connect(mongourl, {
  useNewUrlParser: true
}).then(
  () => {
    log4jslogger.info('The Database connection is successful');
  },
  err => {
    log4jslogger.info('Error when connecting to the database' + err);
  }
);
//set moongoose connection
var moongoseconn = mongoose.connection;

const router = express.Router();

// home router
router.get("/", (req, res) => {
  res.render("cart");
});

// Payment processing code here ...
router.post("/pay", (req, res) => {
  req.checkBody("quotecategory", "Select a Quote category").notEmpty();
  req.checkBody("email", "Enter an Email Address to receive the quotes in").notEmpty();
  req.checkBody("phonenumber", "Use an M-PESA registered, Kenyan phone number (in this format --> 254712345678)").isMobilePhone("en-KE");

  let errors = req.validationErrors();
  let newuserdata = "";
  lipanampesaAllResponse = false;
  req.checkBody("email", "Enter an Email Address to receive the quotes in").notEmpty();

  if (errors) {
    res.render("cart", {
      title: "Please Correct the following errors",
      errors: errors,
      csserroralertclass: "message is-danger"
    });
    /*
    Am logging all attempted requests with log4js to log4js.log
    It's not really useful, you can collect this data on a DB
    am just being paranoid
    */
    let incompleteUserData = {
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      quotecategory: req.body.quotecategory,
    };

    log4jslogger.info("#400 .... Incomplete User Data. Request Not Submitted To M-PESA " + JSON.stringify(incompleteUserData));
  } else {
    newuserdata = {
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      quotecategory: req.body.quotecategory
    };

    // Put this data in a db to reference during payment processing and quote sending

    // Process Payment here
    const consumer_key = "9cTmL66nSbBGUHpnDJoxzjpiGV7SAd9N";
    const consumer_secret = "TEYbiahbnSmUErPV";
    const url =
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"; //change this after going live
    let auth =
      "Basic " +
      new Buffer(consumer_key + ":" + consumer_secret).toString("base64");
    const url_for_api =
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"; //change this after going live
    let phoneNumber = newuserdata.phonenumber; //the phone number in which to send the stk push
    const shortCode = "174379"; //this is the testing shortcode change it to your own after going live
    const passkey =
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"; //change this after going live
    const amount = "1";
    const callBackURL = "https://buyquotes.herokuapp.com/lipanampesa/success"; //your callback url for which to pick thwe json data returned
    const accountReference = "muguku.co.ke"; //any specific reference
    const transactionDesc = "Buy quotes from muguku.co.ke";
    let timestamp = moment().format("YYYYMMDDHHmmss");
    let password;

    function getToken(tokenParam) {
      let oauth_token;
      request({
          url: url,
          headers: {
            Authorization: auth
          }
        },
        function (error, response, body) {
          let oauth_body = JSON.parse(body);
          oauth_token = oauth_body.access_token;
          tokenParam(oauth_token);
        }
      );
    }

    getToken(function (token) {
      let oauth_token = token;
      let auth_for_api = "Bearer " + oauth_token;
      password = base64.encode(shortCode + passkey + timestamp);

      request({
          method: "POST",
          url: url_for_api,
          headers: {
            Authorization: auth_for_api
          },
          json: {
            BusinessShortCode: shortCode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline", //this can change depending on paybill or till number
            Amount: amount,
            PartyA: phoneNumber,
            PartyB: shortCode,
            PhoneNumber: phoneNumber,
            CallBackURL: callBackURL,
            AccountReference: accountReference,
            TransactionDesc: transactionDesc
          }
        },

        function (error, response, body) {
          // If Submission to M-Pesa succeeds log and render success message
          if (body.CustomerMessage) {
            // Am logging all successfull requests with log4js to log4js.log
            let completeUserData = JSON.stringify(newuserdata);
            log4jslogger.info("#200 .... Request successfully Submited to M-PESA " + completeUserData);
            // Also logging the response back from mpesa
            log4jslogger.info(".............Response Parameters..................");
            log4jslogger.info(JSON.stringify(body));
            log4jslogger.info("............./Response Parameters.................");
            res.render("cart", {
              processingtitle: "Order complete; Submission Successful; Processing Payment",
              sendingToMpesaSucceeds: body.CustomerMessage,
              cssalertforloading: "message is-success"
            });
            // insert transaction history to DB here?

            /*
              Merge the two objects (newuserdata and req.body)
              so they can be inserted into mongodb as a single collection
            */
            let newjsononject = {
              newuserdata,
              body
            };
            //use moongose to insert the two objects in a mongoDB as a single object
            moongoseconn.collection('collectionName').insertOne(newjsononject);
          }
          // If Submission to M-Pesa fails 
          else {
            // Am logging all failed requests with log4js to log4js.log
            let incompleteUserData = {
              phonenumber: req.body.phonenumber,
              email: req.body.email,
              quotecategory: req.body.quotecategory,
            };
            log4jslogger.info("#500 .... Bad Request. Request Submitted To M-PESA but rejected " + JSON.stringify(incompleteUserData));
            log4jslogger.info(body);
            res.render("cart", {
              errortitle: "My request just failed, and everything is worse now",
              sendingToMpesaFails: body.errorMessage,
              csserroralertclass: "message is-danger"
            });
            // insert transaction history to DB here?
          }
        }
      );
    });
  }
});


// Start of Mpesa functions

/*
	LipaNaMPesa SuccessURL
	URL: /lipanampesa/success
*/
router.post("/lipanampesa/success", (req, res) => {
  /*
    Check the ResultCode from the response object,
    if ResultCode is 0 the transaction was successfull,
    if ResultCode is 1032 the transaction was either canceled by the user,
    failed due to lack of enough funds or due to server overload
  */

  let lipaNaMpesaResultCode = req.body.Body.stkCallback.ResultCode; //The ResultCode
  let lipanaMpesaResponse = req.body.Body.stkCallback.ResultDesc; //The ResultDescription
  let lipaNaMpesaResult = req.body; //The whole result body.. for mongo
  let tempnewbody = {
    lipaNaMpesaResult,
    "kwapa": "kwapa!"
  }
  let CheckoutRequestID = req.body.Body.stkCallback.CheckoutRequestID;
  console.log("the body is: " + tempnewbody);
  if (lipaNaMpesaResultCode === 0) {
    // Render the success message to the front end
    res.render("cart", {
      lipanampesaResponse: lipanaMpesaResponse,
      lipaNaMpesaTitle: "Money recived!; we done did it!; whose the goat fam?",
      lipaNaMpesaCSS: "message is-success"
    });
    // Send the Email with The Quotes Here
    let sendTheEmail = require('./sendemail.js');
    sendTheEmail.sendEmail("machariamuguku@gmail.com", "<p>this is yet another test mate!</p>");
    // log the success results in MOngoDB?
    log4jslogger.info(prettyjson.render('you actually paid! respect!'));
  } else if (lipaNaMpesaResultCode === 1032) {
    // Render the failure message to the front end
    res.render("cart", {
      lipanampesaResponse: lipanaMpesaResponse,
      lipaNaMpesaTitle: "You got the lipa na mpesa prompt but you pressed decline, didn't you?",
      lipaNaMpesaCSS: "message is-danger"
    });
    // log the success results in MOngoDB?
    log4jslogger.info(prettyjson.render('i F knewed you aint gonna pay!'));
    //insert to db
    moongoseconn.collection('collectionName').updateOne({
      "Body.stkCallback.CheckoutRequestID": "ws_CO_DMZ_258353958_04032019180532453"
    }, {
      $set: {
        tempnewbody
      }
    });
  } else {
    res.render("cart", {
      lipanampesaResponse: lipanaMpesaResponse,
      lipaNaMpesaTitle: "I don't even know what happened!",
      lipaNaMpesaCSS: "message is-danger"
    });

    // log the success results in MOngoDB?
    log4jslogger.info('What happened?' + req.body);
  }

  // Format and send success message to safaricom servers
  // let message = {
  //   ResponseCode: "00000000",
  //   ResponseDesc: "success"
  // };
  // res.json(message);
});

// End of Mpesa functions
module.exports = router;
const express = require("express");
const prettyjson = require("prettyjson");
const request = require("request");
const moment = require("moment");
const base64 = require("base-64");
var nodemailer = require('nodemailer');

const router = express.Router();

// home router
router.get("/", (req, res) => {
  res.render("cart");
});

router.get('/youpaid', (req, res) => {
  res.render('youpaid')
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
  } else {
    newuserdata = {
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      quotecategory: req.body.quotecategory
    };
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
            console.log(".............Response Parameters..................");
            console.log(body);
            console.log("............./Response Parameters.................");
            res.render("cart", {
              processingtitle: "Order complete; Submission Successful; Processing Payment",
              sendingToMpesaSucceeds: body.CustomerMessage,
              cssalertforloading: "message is-success"
            });
            // insert transaction history to DB here?
          }
          // If Submission to M-Pesa fails 
          else {
            console.log(error);
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
    console.log(prettyjson.render('you actually paid! respect!'));
  } else if (lipaNaMpesaResultCode === 1032) {
    // Render the failure message to the front end
    res.render("cart", {
      lipanampesaResponse: lipanaMpesaResponse,
      lipaNaMpesaTitle: "You got the lipa na mpesa prompt but you pressed decline, didn't you?",
      lipaNaMpesaCSS: "message is-danger"
    });
    // log the success results in MOngoDB?
    console.log(prettyjson.render('i F knewed you aint gonna pay!'))
  } else {
    res.render("cart", {
      lipanampesaResponse: lipanaMpesaResponse,
      lipaNaMpesaTitle: "I don't even know what happened!",
      lipaNaMpesaCSS: "message is-danger"
    });

    // log the success results in MOngoDB?
    console.log('What happened?' + req.body);
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
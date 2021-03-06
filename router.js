const express = require("express");
const request = require("request");
const moment = require("moment");
const base64 = require("base-64");
const log4jslogger = require("./log4js");
const moongoseconn = require("./mongoDBconnector");
require("dotenv").config();

//set up express router
const router = express.Router();

// home router
router.get("/", (req, res) => {
  res.render("cart");
});

// Payment processing router
router.post("/pay", (req, res) => {
  // express validator modules
  req.checkBody("quotecategory", "Select a Quote category").notEmpty();
  req
    .checkBody("email", "Enter an Email Address to receive the quotes in")
    .notEmpty();
  req
    .checkBody(
      "phonenumber",
      "Use an M-PESA registered, Kenyan phone number (in this format --> 254712345678)"
    )
    .isMobilePhone("en-KE");

  let errors = req.validationErrors();

  if (errors) {
    res.render("cart", {
      errors: errors,
      title: "Please Correct the following errors",
      cssmessageclass: "message is-danger"
    });
    //Convert the incomplete request data into a javascript object
    let incompleteUserData1 = {
      phonenumber: req.body.phonenumber,
      email: req.body.email,
      quotecategory: req.body.quotecategory
    };
    /*
    Am logging all attempted requests with log4js to log4js.log
    It's not really useful, you can collect this data on a DB
    am just being paranoid
    */
    log4jslogger.info(
      "#400 .... Incomplete User Data. Request Not Submitted To M-PESA " +
      JSON.stringify(incompleteUserData1)
    );
  } else {
    // Process Payment here

    // Global variables
    const consumer_key = "YOUR_CONSUMER_KEY_HERE";
    const consumer_secret = "YOUR_CONSUMER_SECRET_HERE";
    const url =
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"; //change this after going live
    let auth =
      "Basic " +
      new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");
    const url_for_api =
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"; //change this after going live
    const shortCode = "YOUR_TEST_SHORTCODE_HERE"; //this is the testing shortcode change it to your own after going live
    const passkey = "YOUR_PASSKEY_HERE"; //change this after going live
    const amount = "10";
    const callBackURL = "YOUR_CALLBACK_URL_HERE"; //your callback url for which to pick the json data returned
    const accountReference = "YOUR_ACCOUNT_REFERENCE_HERE"; //any specific reference
    const transactionDesc = "YOUR_TRANSACTION_DESCRIPTION_HERE";
    let timestamp = moment().format("YYYYMMDDHHmmss");
    let password = base64.encode(shortCode + passkey + timestamp);

    // Global functions
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

    let phoneNumber = req.body.phonenumber; //the phone number in which to send the stk push
    getToken(function (token) {
      let oauth_token = token;
      let auth_for_api = "Bearer " + oauth_token;

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
          /*
            If Submission to M-Pesa succeeds 
            render success message to the front end 
            and push the data to mongoDB
          */
          let CheckoutRequestID = body.CheckoutRequestID;
          if (CheckoutRequestID) {
            res.render("cart", {
              sendingToMpesaSucceeds: body.CustomerMessage,
              title: "Order complete; Submission Successful; Processing Payment",
              cssmessageclass: "message is-success"
            });
            /*
              Merge the two objects 
              (user data from req.body and body from mpesa response)
              so they can be inserted into mongodb as a single collection
            */

            // CheckoutRequestIDRef: body.CheckoutRequestID,
            let allUserData = {
              phonenumber: req.body.phonenumber,
              email: req.body.email,
              quotecategory: req.body.quotecategory,
              mpesamethods: [{
                MerchantRequestID: body.MerchantRequestID,
                CheckoutRequestID: CheckoutRequestID,
                ResponseCode: body.ResponseCode,
                ResponseDescription: body.ResponseDescription,
                CustomerMessage: body.CustomerMessage
              }]
            };
            // Am logging all successfull requests with log4js to log4js.log
            log4jslogger.info(
              "#200 .... Request successfully Submited to M-PESA " +
              JSON.stringify(allUserData)
            );
            //use moongose to insert the two objects in a mongoDB as a single object
            moongoseconn.collection("QuotesCollection").insertOne(allUserData);

            // Go to async that waits for response from M-PESA and does things with it

            // Process Payment here
            //Lipa na M-Pesa Online Query Request
            getTheTransactionStatus = () => {
              getToken(function (token) {
                let succeeds;
                let request = require("request"),
                  oauth_token = token,
                  url =
                  "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query";
                auth = "Bearer " + oauth_token;

                request({
                    method: "POST",
                    url: url,
                    headers: {
                      Authorization: auth
                    },
                    json: {
                      BusinessShortCode: shortCode,
                      Password: password,
                      Timestamp: timestamp,
                      CheckoutRequestID: CheckoutRequestID
                    }
                  },
                  function (error, response, body) {
                    // TODO: Use the body object to extract the response

                    /*
                      Check the ResultCode from the response object,
                      if ResultCode is 0 the transaction was successfull,
                      if ResultCode is 1032 the transaction was either canceled by the user,
                      failed due to lack of enough funds or due to server overload
                    */

                    if (body.ResultCode == 0) {
                      const getQuotes = require("./thequotes");

                      // Sting concatenation failed.. condition was the only way
                      let quotecategory;
                      if (allUserData.quotecategory == "Programming") {
                        quotecategory = Programming.quotes;
                      } else if (allUserData.quotecategory == "Workout") {
                        quotecategory = Workout.quotes;
                      } else if (allUserData.quotecategory == "Motivation") {
                        quotecategory = Motivation.quotes;
                      } else if (allUserData.quotecategory == "Love") {
                        quotecategory = Love.quotes;
                      }
                      let quotesobjects = getQuotes(quotecategory); //look at thequotes.js to understand the arguments
                      //call and set the email objects with response
                      const sendTheEmail = require("./sendemail.js"); //call sendemail.js
                      let sendto = allUserData.email; //define send to variable
                      let emailsubject = `${allUserData.quotecategory}: Quotes Delivered by buyquotes.herokuapp.com`; //set email subject
                      let emailbody = `<p>${quotesobjects}</p> <p>powered by: http://www.muguku.co.ke/</p>`; //set the email body
                      // Send the Email with The Quotes Here
                      sendTheEmail.sendEmail(sendto, emailsubject, emailbody);
                      // log the success in log4js file
                      log4jslogger.info("#Mpesa-Success .... Someone successfully paid");
                    }
                    // end
                    else if (body.ResultCode == 1032) {
                      console.log("someone cancelled the transaction!!!!");
                      log4jslogger.info(
                        "#Mpesa-Canceled .... Someone cancelled Mpesa payment stk push")
                    }
                    /*
                    if (body.ResponseCode) {
                      console.log("the success " + JSON.stringify(body));
                        // // Render the success message to the front end
                        // res.render("cart", {
                        //   succeeds: succeeds,
                        //   title:
                        //     "Money recived!; we done did it!; whose the goat fam?",
                        //   cssmessageclass: "message is-success"
                        // });
                      } else {
                        console.log("the error " + JSON.stringify(error));
                      }
                      // console.log("This is what you've been waiting for: ");
                      // console.log(JSON.stringify(CheckoutRequestID));
                      // console.log("and.....");

                      */
                  }
                );
              });
            };

            /*
            // set a timer interval to check status every 10 secconds
            recheckStatus = setInterval(getwatchu, 5000);

            //set a timout to clear for the interval to prevent it from running forever
            stopTheInterval = () => {
              clearInterval(recheckStatus);
            };

            // initialise the timout with a one minute 35 seconds timout period
            setTimeout(stopTheInterval, 21000);
            */

            /*
            set a timout to run the function after 2.1 minutes
            this was informed by the fact that...
            the stk push time's out after 2 minutes of inactivity.
            The transaction will likely either have succeeded or failed at this point
            */
            setTimeout(getTheTransactionStatus, 126000);
          }
          // If Submission to M-Pesa fails
          else {
            let incompleteUserData2 = {
              phonenumber: req.body.phonenumber,
              email: req.body.email,
              quotecategory: req.body.quotecategory
            };
            // Am logging all failed requests with log4js to log4js.log
            log4jslogger.info(
              "#500 .... Bad Request. Request Submitted To M-PESA but rejected " +
              JSON.stringify(incompleteUserData2)
            );
            res.render("cart", {
              sendingToMpesaFails: body.errorMessage,
              title: "My request just failed, and everything is worse now",
              cssmessageclass: "message is-danger"
            });
          }
        }
      );
    });
  }
});

// Mpesa callbacks
/*
	LipaNaMPesa SuccessURL
	URL: /lipanampesa/success
*/
router.post("/lipanampesa/success", (req, res) => {
  let CheckoutRequestID = req.body.Body.stkCallback.CheckoutRequestID;
  //insert to mongoDB
  moongoseconn.collection("QuotesCollection").update({
    "mpesamethods.CheckoutRequestID": CheckoutRequestID
  }, {
    $push: {
      mpesamethods: {
        ResultBody: req.body.Body
      }
    }
  });

  // Format success message to send to safaricom servers
  let message = {
    ResponseCode: "00000000",
    ResponseDesc: "success"
  };

  //send the success message to safaricom servers
  res.json(message);
});

// //Process the payments here
//   /*
//     Check the ResultCode from the response object,
//     if ResultCode is 0 the transaction was successfull,
//     if ResultCode is 1032 the transaction was either canceled by the user,
//     failed due to lack of enough funds or due to server overload
//   */

//   if (req.body.Body.stkCallback.ResultCode == 0) {
//     //insert to mongoDB
//     moongoseconn.collection("QuotesCollection").update(
//       {
//         "mpesamethods.CheckoutRequestID":
//           req.body.Body.stkCallback.CheckoutRequestID
//       },
//       {
//         $push: {
//           mpesamethods: {
//             MerchantRequestID: req.body.Body.stkCallback.MerchantRequestID,
//             CheckoutRequestID: req.body.Body.stkCallback.CheckoutRequestID,
//             ResultCode: req.body.Body.stkCallback.ResultCode,
//             ResultDesc: req.body.Body.stkCallback.ResultDesc,
//             CallbackMetadata: req.body.Body.stkCallback.CallbackMetadata
//           }
//         }
//       }
//     );

//     // log the success in log4js file
//     log4jslogger.info("#Mpesa-Success .... Someone successfully paid");

//     // start
//     /*
//       Get email address and quote category from the MongoDB object
//       and parse this to the send email method
//     */
//     let emailobjects;
//     moongoseconn.collection("QuotesCollection").findOne(
//       {
//         "mpesamethods.MerchantRequestID":
//           req.body.Body.stkCallback.MerchantRequestID
//       },
//       (err, res) => {
//         if (err) throw new Error(err.message, null);
//         emailobjects = res;
//         let getQuotes = require("./thequotes");
//         /*
//       Sting concatenation failed.. condition was the only way
//       */
//         let quotecategory1;
//         if (emailobjects.quotecategory == "Programming") {
//           quotecategory1 = Programming.quotes;
//         } else if (emailobjects.quotecategory == "Workout") {
//           quotecategory1 = Workout.quotes;
//         } else if (emailobjects.quotecategory == "Motivation") {
//           quotecategory1 = Motivation.quotes;
//         } else if (emailobjects.quotecategory == "Love") {
//           quotecategory1 = Love.quotes;
//         } else {
//           quotecategory1 = Programming.quotes;
//         }
//         quotesobjects = getQuotes(quotecategory1); //look at thequotes.js to understand the arguments
//         //call and set the email objects with response
//         const sendTheEmail = require("./sendemail.js"); //call sendemail.js
//         let sendto = emailobjects.email; //define send to variable
//         let quotecategory = emailobjects.quotecategory;
//         let emailsubject =
//           quotecategory + " " + "Quotes Delivered by buyquotes.herokuapp.com"; //set email subject
//         let emailbody =
//           "<p>" +
//           quotesobjects +
//           "</p> <p>powered by: http://www.muguku.co.ke/</p>"; //set the email body
//         // Send the Email with The Quotes Here
//         sendTheEmail.sendEmail(sendto, emailsubject, emailbody);
//       }
//     );
//     // end
//   } else if (req.body.Body.stkCallback.ResultCode == 1032) {
//     //insert to mongoDB
//     moongoseconn.collection("QuotesCollection").update(
//       {
//         "mpesamethods.MerchantRequestID":
//           req.body.Body.stkCallback.MerchantRequestID
//       },
//       {
//         $push: {
//           mpesamethods: {
//             MerchantRequestID: req.body.Body.stkCallback.MerchantRequestID,
//             CheckoutRequestID: req.body.Body.stkCallback.CheckoutRequestID,
//             ResultCode: req.body.Body.stkCallback.ResultCode,
//             ResultDesc: req.body.Body.stkCallback.ResultDesc
//           }
//         }
//       }
//     );

//     log4jslogger.info(
//       "#Mpesa-Canceled .... Someone cancelled Mpesa payment stk push"
//     );
//   } else {
//     // log the success results in MOngoDB?
//     log4jslogger.info("#Unprecedented error .... occured" + req.body);
//   }

//   /*
//     // Render the success message to the front end
//     res.render("cart", {
//       lipanampesaResponse: lipanaMpesaResponse,
//       title: "Money recived!; we done did it!; whose the goat fam?",
//       cssmessageclass: "message is-success"
//     });
//     */

//   /*
//     // Render the failure message to the front end
//     res.render("cart", {
//       lipanampesaResponse: lipanaMpesaResponse,
//       title: "You got the lipa na mpesa prompt but you pressed decline, didn't you?",
//       cssmessageclass: "message is-danger"
//     });
//     */

//   /*
//     // Render unprecedented error message to the front end
//    res.render("cart", {
//     lipanampesaResponse: lipanaMpesaResponse,
//     title: "I don't even know what happened!",
//     cssmessageclass: "message is-danger"
//   });
//       */
// });

// End of Mpesa functions
module.exports = router;
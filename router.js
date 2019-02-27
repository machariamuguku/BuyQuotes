const express = require("express");
const prettyjson = require("prettyjson");
const request = require("request");
const moment = require("moment");
const base64 = require("base-64");

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
  req
    .checkBody(
      "phonenumber",
      "Enter an M-PESA registered Phone number to receive the payment prompt "
    )
    .notEmpty()
    .isMobilePhone("en-KE")
    .withMessage(
      "Please use a Kenyan phone number format (eg., +254712345678)"
    );
  req
    .checkBody("email", "Enter an Email Address to receive the quotes in")
    .notEmpty();
  req.checkBody("quotecategory", "Please select a Quotes category").notEmpty();

  let errors = req.validationErrors();
  let newuserdata = "";
  lipanampesaAllResponse = false;

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
    const amount = "10";
    // const callBackURL = "https://ngara.co.ke/callback"; //your callback url for which to pick thwe json data returned
    const callBackURL = "https://buyquotes.herokuapp.com/lipanampesa/success";
    const accountReference = "muguku.co.ke"; //any specific reference
    const transactionDesc = "Buy quotes muguku.co.ke";
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
          if (body.CustomerMessage) {
            console.log(prettyjson.render(""));
            console.log(
              prettyjson.render(
                ".............Response Parameters.................."
              )
            );
            console.log(prettyjson.render(""));
            console.log(prettyjson.render(body));
            console.log(prettyjson.render(""));
            console.log(
              prettyjson.render(
                "............./Response Parameters................."
              )
            );
            console.log(prettyjson.render(""));
            res.render("cart", {
              processingtitle: "Order complete; Submission Successful; Processing Payment",
              sendingToMpesaSucceeds: body.CustomerMessage,
              cssalertforloading: "message is-success"
            });
          } else {
            console.log(prettyjson.render(error));
            res.render("cart", {
              errortitle: "My request just failed, and everything is worse now",
              sendingToMpesaFails: body.errorMessage,
              csserroralertclass: "message is-danger"
            });
          }
        }
      );
    });

    res.redirect('/youpaid');
    // insert transaction history to DB here
    // default success false on every transaction whether successful or not
    // Send Quotes here
    // If successfull res.render transaction successful to message
    // write success true message to DB if success
  }
});

// Mpesa functions

/*
	LipaNaMPesa SuccessURL
	URL: /lipanampesa/success
*/
router.post("/lipanampesa/success", (req, res) => {
  // let message = {
  //   ResponseCode: "00000000",
  //   ResponseDesc: "success"
  // };
  // res.json(message);

  // if mpesa succeeds
  // let lipanampesasuccess = req.body.ResultCode;
  let lipanampesaAllResponse = req.body;

  if (lipanampesaAllResponse) {
    lipanampesaAllResponse = JSON.stringify(req.body);
    console.log(lipanampesaAllResponse);
    console.log('........................');

    res.redirect('http://google.com');
  };
  // res.render("cart", {
  //   lipanampesaAllResponse: lipanampesaAllResponse,
  //   lipanaMpesaSuccessOrFailedTitle: "Money recived!; we done did it!; whose the goat fam?",
  //   cssalertforloading: "message is-success"
  // });

  // let lipanampesasuccess = req.body.ResultCode;

  // if (req.body.ResultCode == '0') {
  //   res.render("cart", {
  //     // lipanampesaAllResponse: lipanampesaAllResponse,
  //     lipanampesaAllResponse: true,
  //     lipanaMpesaSuccessOrFailedTitle: "Money recived!; we done did it!; whose the goat fam?",
  //     cssalertforloading: "message is-success"
  //   });
  //   console.log(prettyjson.render('you actually paid! touche'));
  // } else if (req.body.ResultCode == '1032') {
  //   res.render("cart", {
  //     // lipanampesaAllResponse: lipanampesaAllResponse,
  //     lipanampesaAllResponse: false,
  //     lipanaMpesaSuccessOrFailedTitle: "You got the lipa na mpesa prompt but you pressed decline, didn't you?",
  //     cssalertforloading: "message is-danger"
  //   });
  //   console.log(prettyjson.render('i F knewed you aint gonna pay'))
  // }

  // console.log("");
  // console.log("-----------Received M-Pesa webhook-----------");
  // console.log("");
  // // format and dump the request payload recieved from safaricom in the terminal
  // console.log(prettyjson.render(req.body));
  // console.log("");
  // console.log("-----------Received M-Pesa webhook------------");
  // console.log("");
});

// Mpesa functions

// Receive payment notification here ...

module.exports = router;
const express = require('express');
var mpesamethods = require('./makepayments');

// Require Africa's Talking SDK here ...

const router = express.Router();

// Initialize Africa's Talking SDK here ...

router.get('/', (req, res) => {
    res.render('cart');
});

// confirmation URL
router.get('/confirmation', (req, res) => {

    funct2 = function(
funct1= function(){
    var request = require('request'),
    consumer_key = "9cTmL66nSbBGUHpnDJoxzjpiGV7SAd9N",
    consumer_secret = "YOUR_APP_TEYbiahbnSmUErPVCONSUMER_SECRET",
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");
  
    request(
      {
        url : url,
        headers : {
          "Authorization" : auth
        }
      },
      function (error, response, body) {
        // TODO: Use the body object to extract OAuth access token
      }
    )
}){
        var request = require('request'),
  oauth_token = funct1(),
  url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
  auth = "Bearer " + oauth_token;

  request(
    {
      method: 'POST',
      url : url,
      headers : {
        "Authorization" : auth
      },
      json : {
        "ShortCode": "600000",
        "ResponseType": "confirmed",
        "ConfirmationURL": "https://buyquotes.herokuapp.com/confirmation",
        "ValidationURL": "https://buyquotes.herokuapp.com/confirmation/validation"
      }
    },
    function (error, response, body) {
      // TODO: Use the body object to extract the 
      console.log(body)
    }
  )

    }
    res.render('confirmation', {
        title: funct2()
    });
    res.redirect('/confirmation');
});

// ValidationURL
router.get('/validation', (req, res) => {
    res.render('cart');
});

// Payment processing code here ...
router.post('/', (req, res) => {

    req.checkBody("phonenumber", "Enter an M-PESA registered Phone number to receive the payment prompt ").notEmpty().isMobilePhone("en-KE").withMessage('Please use a Kenyan phone number format (eg., +254712345678)');
    req.checkBody("email", "Enter an Email Address to receive the quotes in").notEmpty();
    req.checkBody("quotecategory", "Please select a Quotes category").notEmpty();

    let errors = req.validationErrors();
    let newuserdata = "";

    if (errors) {
        res.render("cart", {
            title: "Please Correct the following errors",
            errors: errors,
            cssalertclass: "message is-danger"
        });
    } else {
        newuserdata = {
            phonenumber: req.body.phonenumber,
            email: req.body.email,
            quotecategory: req.body.quotecategory
        };

        if (newuserdata) {
            res.render("cart", {
                processingtitle: "Order complete; Submission Successful; Processing Payment",
                newuserdata: newuserdata,
                cssalertforloading: "message is-success",
            });
            // insert transaction history to DB here 
            // default success false on every transaction whether successful or not

            // Process Payment here
            mpesamethods.generateValidationURL();
        }

        // Send Quotes here
        // If successfull res.render transaction successful to message
        // write success true message to DB if success
    }

});

// Receive payment notification here ...

module.exports = router;
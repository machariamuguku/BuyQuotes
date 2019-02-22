const express = require('express');
const path = require('path');

// Require MPESA SDK here ...
const Mpesa = require('mpesa-node')
const mpesaApi = new Mpesa({
  consumerKey: '9cTmL66nSbBGUHpnDJoxzjpiGV7SAd9N',
  consumerSecret: 'TEYbiahbnSmUErPV',
  environment: 'sandbox',
  shortCode: '600111',
  initiatorName: 'Test Initiator',
  lipaNaMpesaShortCode: 123456,
  lipaNaMpesaShortPass: '<some key here>',
  securityCredential: '<credential here>',
  certPath: path.resolve('keys/myKey.cert'),
})

const emitter = require('mpesa-node/src/helpers/callbacksemitter')

const router = express.Router();

// Initialize Africa's Talking SDK here ...

router.get('/', (req, res) => {
  res.render('cart');
});

// Mpesa functions
// Lipa na mpesa
router.post('/lipanampesa/success', (req, res) => {
  emitter.emit('lipaNaMpesaOnlineSuccessCallback', req.body)
  res.json({
    'ResponseCode': '00000000',
    'ResponseDesc': 'success'
  })
})

// Mpesa functions

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
      // res.render("cart", {
      //   processingtitle: "Order complete; Submission Successful; Processing Payment",
      //   newuserdata: newuserdata,
      //   cssalertforloading: "message is-success",
      // });
      // insert transaction history to DB here 
      // default success false on every transaction whether successful or not

      // Process Payment here
      let msdin = newuserdata.phonenumber
      console.log("what am looking for "+ msdin)
      let senderMsisdn = newuserdata.phonenumber
      let amount = 10
      let callbackUrl = ""
      let accountRef = "ujuuui"

      mpesaApi
        .lipaNaMpesaOnline(senderMsisdn, amount, callbackUrl, accountRef, transactionDesc = 'Lipa na mpesa online', transactionType = 'CustomerPayBillOnline', shortCode = null, passKey = null)
        .then((result) => {
          //do something
          console.log("this is the " + result)
        })
        .catch((err) => {
          // retry?
        })

    }

    // Send Quotes here
    // If successfull res.render transaction successful to message
    // write success true message to DB if success
  }

});

// Receive payment notification here ...

module.exports = router;
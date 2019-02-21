const express = require('express');

// mpesa test thingy
// const emitter = require('.tests/helpers/callbacksemitter');
const emitter = require('./mpesa-node-library/tests/helpers/callbacksemitter');

// Require Africa's Talking SDK here ...

const router = express.Router();

// Initialize Africa's Talking SDK here ...

router.get('/', (req, res) => {
    res.render('cart');
});

// Mpesa functions

// AccountBalance
router.post('/accountbalance/timeout', (req, res) => {
    emitter.emit('accountBalanceTimeout', { simulation: true, success: true })
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  router.post('/accountbalance/success', (req, res) => {
    emitter.emit('accountBalanceCallback', req.body)
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  
  // B2B Call
  router.post('/b2b/timeout', (req, res) => {
    emitter.emit('b2bTimeout', { simulation: true, success: true })
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  router.post('/b2b/success', (req, res) => {
    emitter.emit('b2bSuccessCallback', req.body)
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  // B2C Call
  router.post('/b2c/timeout', (req, res) => {
    emitter.emit('b2cTimeout', { simulation: true, success: true })
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  router.post('/b2c/success', (req, res) => {
    emitter.emit('b2cSuccessCallback', req.body)
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  // C2B
  router.post('/c2b/confirmation', (req, res) => {
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  router.post('/c2b/success', (req, res) => {
    emitter.emit('c2bSuccessCallback', req.body)
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  
  // Lipa na mpesa
  router.post('/lipanampesa/success', (req, res) => {
    emitter.emit('lipaNaMpesaOnlineSuccessCallback', req.body)
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  
  // Reversal
  router.post('/reversal/timeout', (req, res) => {
    emitter.emit('reversalTimeout', { simulation: true, success: true })
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  router.post('/reversal/success', (req, res) => {
    emitter.emit('reversalSuccessCallback', req.body)
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  
  // Transaction Status
  router.post('/transactionstatus/timeout', (req, res) => {
    emitter.emit('transactionStatusTimeout', { simulation: true, success: true })
    res.json({
      'ResponseCode': '00000000',
      'ResponseDesc': 'success'
    })
  })
  router.post('/transactionstatus/success', (req, res) => {
    emitter.emit('transactionStatusSuccessCallback', req.body)
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
            res.render("cart", {
                processingtitle: "Order complete; Submission Successful; Processing Payment",
                newuserdata: newuserdata,
                cssalertforloading: "message is-success",
            });
            // insert transaction history to DB here 
            // default success false on every transaction whether successful or not

            // Process Payment here
        }

        // Send Quotes here
        // If successfull res.render transaction successful to message
        // write success true message to DB if success
    }

});

// Receive payment notification here ...

module.exports = router;
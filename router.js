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
    res.render('cart');
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
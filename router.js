const express = require('express');
const {
    check
} = require('express-validator/check')

// Require Africa's Talking SDK here ...

const router = express.Router();

// Initialize Africa's Talking SDK here ...

router.get('/', (req, res) => {
    res.render('cart');
});

// Payment processing code here ...
router.post('/pay', (req, res) => {

    req.checkBody("phonenumber", "Enter an M-PESA registered Phone number to receive payment prompt").notEmpty().isMobilePhone("en-KE").withMessage('Please use a Kenyan phone number format (eg., +254712345678)');
    req.checkBody("email", "Enter an Email Address to receive the quotes in").notEmpty();
    req.checkBody("selector", "Please select a Quotes category").notEmpty();

    let errors = req.validationErrors();
    let newuserdata = "";
    let processingmpesa = false;


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
            selector: req.body.selector
        };

        if (newuserdata) {
            res.render("cart", {
                title: "Successfully submitted",
                processingtitle:"Check Your Phone For STK Push message!",
                newuserdata: newuserdata,
                cssalertclass: "message is-success",
                cssalertforloading: "is-primary",
                processingmpesa: true
            });

            // Process Payment here
            console.log(newuserdata);
        }


        // insert to DB here .. or call model or schema or whatever
        // res.redirect('/');
    }

    // const phoneNumber = req.body.phoneNumber;
    // const productName = 'YOUR-PRODUCT-NAME-HERE';

    // const paymentOptions = {
    //     productName: productName,
    //     phoneNumber: phoneNumber,
    //     currencyCode: 'KES',
    //     amount: 1500,
    //     narration: 'Online store payment',
    //     metadata: {
    //         customerEmail: 'jane@doe.com',
    //     },
    // };
    // payments.mobileCheckout(paymentOptions)
    //     .then((response) => {
    //         console.log(JSON.stringify(response, 0, 4));
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    //  res.redirect('/processing');
});

// Receive payment notification here ...

router.get('/processing', (req, res) => {
    res.render('processing');
});

module.exports = router;
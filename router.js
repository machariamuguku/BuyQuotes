const express = require('express');
const prettyjson = require('prettyjson');
const Mpesa = require('mpesa-node');
const path = require('path')

const router = express.Router();

router.get('/', (req, res) => {
	res.render('cart');
});

// Mpesa functions

const options = {
	noColor: true
};
/*
	B2C ResultURL
	URL: /b2c/result
*/
router.post('/b2c/result', (req, res) => {
	console.log('-----------B2C CALLBACK------------');
	console.log(prettyjson.render(req.body, options));
	console.log('-----------------------');

	let message = {
		"ResponseCode": "00000000",
		"ResponseDesc": "success"
	};

	res.json(message);
});

/*
	B2C QueueTimeoutURL
	URL: /b2c/timeout
*/
router.post('/b2c/timeout', (req, res) => {
	console.log('-----------B2C TIMEOUT------------');
	console.log(prettyjson.render(req.body, options));
	console.log('-----------------------');

	let message = {
		"ResponseCode": "00000000",
		"ResponseDesc": "success"
	};

	res.json(message);
});

/*
	C2B ValidationURL
	URL: /c2b/validation
*/
router.post('/c2b/validation', (req, res) => {
	console.log('-----------C2B VALIDATION REQUEST-----------');
	console.log(prettyjson.render(req.body, options));
	console.log('-----------------------');

	let message = {
		"ResultCode": 0,
		"ResultDesc": "Success",
		"ThirdPartyTransID": "1234567890"
	};

	res.json(message);
});

/*
	C2B ConfirmationURL
	URL: /c2b/confirmation
*/
router.post('/c2b/confirmation', (req, res) => {
	console.log('-----------C2B CONFIRMATION REQUEST------------');
	console.log(prettyjson.render(req.body, options));
	console.log('-----------------------');

	let message = {
		"ResultCode": 0,
		"ResultDesc": "Success"
	};


	res.json(message);
});

/*
	B2B ResultURL
	URL: /b2b/result
*/
router.post('/b2b/result', (req, res) => {
	console.log('-----------B2B CALLBACK------------');
	console.log(prettyjson.render(req.body, options));
	console.log('-----------------------');

	let message = {
		"ResponseCode": "00000000",
		"ResponseDesc": "success"
	};

	res.json(message);
});

/*
	B2B QueueTimeoutURL
	URL: /api/v1/b2b/timeout
*/
router.post('/b2b/timeout', (req, res) => {
	console.log('-----------B2B TIMEOUT------------');
	console.log(prettyjson.render(req.body, options));
	console.log('-----------------------');

	let message = {
		"ResponseCode": "00000000",
		"ResponseDesc": "success"
	};

	res.json(message);
});

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


		// res.render("cart", {
		// 	processingtitle: "Order complete; Submission Successful; Processing Payment",
		// 	newuserdata: newuserdata,
		// 	cssalertforloading: "message is-success",
		// });


		// insert transaction history to DB here 
		// default success false on every transaction whether successful or not

		// Process Payment here
		let testMSISDN = newuserdata.phonenumber
		let amount = 10
		let callbackUrl = "https://buyquotes.herokuapp.com/c2b/confirmation"
		const accountRef = Math.random().toString(35).substr(2, 7)

		const mpesaApi = new Mpesa({
			consumerKey: '9cTmL66nSbBGUHpnDJoxzjpiGV7SAd9N',
			consumerSecret: 'TEYbiahbnSmUErPV',
			environment: 'sandbox',
			shortCode: '601465',
			initiatorName: 'apitest465',
			lipaNaMpesaShortCode: 123456,
			lipaNaMpesaShortPass: '<some key here>',
			securityCredential: '465reset',
			certPath: path.resolve('keys/myKey.cert')
		})

		/*
		 * lipaNaMpesaOnline(senderMsisdn, amount, callbackUrl, accountRef, transactionDesc = 'Lipa na mpesa online', transactionType = 'CustomerPayBillOnline', shortCode = null, passKey = null)
		 * Example:
		 */

		mpesaApi.lipaNaMpesaOnline(testMSISDN, amount, callbackUrl, accountRef)
			.then((result) => {
				//do something
				console.log(JSON.stringify(result, 0, 4));
			})
			.catch((err) => {
				// retry?
			})

		console.log("whats wrong?")

		// Send Quotes here
		// If successfull res.render transaction successful to message
		// write success true message to DB if success
	}

});

// Receive payment notification here ...

module.exports = router;
const express = require('express');
const prettyjson = require('prettyjson');
const Mpesa = require('mpesa-node');
const path = require('path')

const router = express.Router();

router.get('/', (req, res) => {
	res.render('cart');
});

// simulate
router.get('/simulate', (req, res) => {
	res.render('processing');
});

router.post('/simulate', (req, res) => {

	function describe() {
		const emitter = require('.././helpers/callbacksemitter')
		// Process Payment here
		let testMSISDN = '254728655403'
		let amount = 10
		let callbackUrl = "https://buyquotes.herokuapp.com/lipanampesa/success"
		const accountRef = Math.random().toString(35).substr(2, 7)

		const mpesaApi = new Mpesa({
			consumerKey: '9cTmL66nSbBGUHpnDJoxzjpiGV7SAd9N',
			consumerSecret: 'TEYbiahbnSmUErPV',
			environment: 'sandbox',
			shortCode: '601465',
			initiatorName: 'apitest465',
			lipaNaMpesaShortCode: '174379',
			lipaNaMpesaShortPass: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
			securityCredential: 'nMEO/NpTuEbDm4xsGQLh6S4OUEcSeRgkx4hDBQ78L8foJyKUMs6Wj2p/L5Qn54yTOTORDDmCpRGai90b1bp9uvQFLT8eizMQs7iUmWlSqwESRWT7vzG4gzKzz6OkKLcWq+d0v7dDg5L/0vvfpbx/ciTtSSeHLwcTfsyp3N77N+hUhI7DGOqdft26DgDQsNewTTGWmiZNx+x3PDf3oLxL1uR1388nLZ8/uQrxZ/C4ZonmENkZEvQ4TBNWnZIUHChFznZ3LZFJOAvTdQEoXs/hSG1OArv3XVYgfA1zmHRZgEiNgd2331lOuRC/Lre76PAG/K2QfgW+hbDPpE8v/WJ06A==',
			certPath: path.resolve('keys/myKey.cert')
		})

		function it(done) {
			// Since we have to wait for a time out and das sad and
			this.timeout(200 * 1000) // 200s

			/*
			 * lipaNaMpesaOnline(senderMsisdn, amount, callbackUrl, accountRef, transactionDesc = 'Lipa na mpesa online', transactionType = 'CustomerPayBillOnline', shortCode = null, passKey = null)
			 * Example:
			 */
			mpesaApi.lipaNaMpesaOnline(testMSISDN, amount, callbackUrl, accountRef)
				// mpesaApi.lipaNaMpesaOnline(testMSISDN, amount, callbackUrl, accountRef)
				.then(({
					data
				}) => {
					checkoutRequestId = data['CheckoutRequestID']

					// send processing message
					//do something
					// console.log(prettyjson.render(result));
					let mpesaresult = prettyjson.render(data);
					res.render("cart", {
						processingtitle: "Order complete; Submission Successful; Processing Payment",
						mpesasucceeds: mpesaresult,
						cssalertforloading: "message is-success",
					});


				})
				.catch(e => {
					res.render("cart", {
						errortitle: "My request just failed, and everything is worse now",
						mpesafails: e.message,
						csserroralertclass: "message is-danger",
					});
					throw new Error('Something went wrong. Message: ' + e.message + ' ' + e.response.message)
				})

			emitter.on('lipaNaMpesaOnlineSuccessCallback', function (payload) {
				expect(payload).to.be.ok()
				done()
			})
		}

		// check transaction status here
	};
})
// end of simulate

// Payment processing code here ...
router.post('/pay', (req, res) => {

	req.checkBody("phonenumber", "Enter an M-PESA registered Phone number to receive the payment prompt ").notEmpty().isMobilePhone("en-KE").withMessage('Please use a Kenyan phone number format (eg., +254712345678)');
	req.checkBody("email", "Enter an Email Address to receive the quotes in").notEmpty();
	req.checkBody("quotecategory", "Please select a Quotes category").notEmpty();

	let errors = req.validationErrors();
	let newuserdata = "";
	let mpesafails = "";
	let mpesasucceeds = "";

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

		// insert transaction history to DB here 
		// default success false on every transaction whether successful or not

		// Process Payment here
		let testMSISDN = newuserdata.phonenumber
		let amount = 10
		let callbackUrl = "https://buyquotes.herokuapp.com/lipanampesa/success"
		const accountRef = "muguku.co.ke"

		const mpesaApi = new Mpesa({
			consumerKey: '9cTmL66nSbBGUHpnDJoxzjpiGV7SAd9N',
			consumerSecret: 'TEYbiahbnSmUErPV',
			environment: 'sandbox',
			shortCode: '601465',
			initiatorName: 'apitest465',
			lipaNaMpesaShortCode: '174379',
			lipaNaMpesaShortPass: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
			securityCredential: 'nMEO/NpTuEbDm4xsGQLh6S4OUEcSeRgkx4hDBQ78L8foJyKUMs6Wj2p/L5Qn54yTOTORDDmCpRGai90b1bp9uvQFLT8eizMQs7iUmWlSqwESRWT7vzG4gzKzz6OkKLcWq+d0v7dDg5L/0vvfpbx/ciTtSSeHLwcTfsyp3N77N+hUhI7DGOqdft26DgDQsNewTTGWmiZNx+x3PDf3oLxL1uR1388nLZ8/uQrxZ/C4ZonmENkZEvQ4TBNWnZIUHChFznZ3LZFJOAvTdQEoXs/hSG1OArv3XVYgfA1zmHRZgEiNgd2331lOuRC/Lre76PAG/K2QfgW+hbDPpE8v/WJ06A==',
			certPath: path.resolve('keys/myKey.cert')
		})
		/*
		 * lipaNaMpesaOnline(senderMsisdn, amount, callbackUrl, accountRef, transactionDesc = 'Lipa na mpesa online', transactionType = 'CustomerPayBillOnline', shortCode = null, passKey = null)
		 * Example:
		 */
		mpesaApi.lipaNaMpesaOnline(testMSISDN, amount, callbackUrl, accountRef)
			// mpesaApi.lipaNaMpesaOnline(testMSISDN, amount, callbackUrl, accountRef)
			.then((response) => {
				// send processing message
				//do something
				let mpesaresult = prettyjson.render(response);
				res.render("cart", {
					processingtitle: "Order complete; Submission Successful; Processing Payment",
					mpesasucceeds: mpesaresult,
					cssalertforloading: "message is-success",
				});
			})
			.catch((error) => {
				// retry?
				let mpesaerr = prettyjson.render(error);
				// send processing message
				res.render("cart", {
					errortitle: "My request just failed, and everything is worse now",
					mpesafails: mpesaerr,
					csserroralertclass: "message is-danger",
				});
			})

		// Send Quotes here
		// If successfull res.render transaction successful to message
		// write success true message to DB if success


	}
});
// Mpesa functions

const options = {
	noColor: true
};
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
	LipaNaMPesa SuccessURL
	URL: /lipanampesa/success
*/
router.post('/lipanampesa/success', (req, res) => {
	console.log('-----------LipaNaMPesa Success------------');
	console.log(prettyjson.render(req.body, options));
	console.log('-----------------------');

	// emitter
	emitter.emit('lipaNaMpesaOnlineSuccessCallback', req.body)

	let message = {
		"ResponseCode": "00000000",
		"ResponseDesc": "success"
	};

	res.json(message);
});

router.get('/lipanampesa/success', (req, res) => {
	console.log('-----------LipaNaMPesa Success------------');
	console.log(prettyjson.render(req.body, options));
	console.log('-----------------------');

	let message = {
		"ResponseCode": "00000000",
		"ResponseDesc": "success"
	};

	res.json(message);
});
// Mpesa functions

// Receive payment notification here ...

module.exports = router;
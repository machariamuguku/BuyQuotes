module.exports = {
    // Function 1: generate access token
    generateAcessToken: function () {
        var accessToken;
        var request = require('request'),
            consumer_key = "9cTmL66nSbBGUHpnDJoxzjpiGV7SAd9N",
            consumer_secret = "TEYbiahbnSmUErPV",
            url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
        auth = "Basic " + new Buffer(consumer_key + ":" + consumer_secret).toString("base64");

        request({
                url: url,
                headers: {
                    "Authorization": auth
                }
            },
            function (error, response, body) {

                if (error) {
                    error = JSON.parse(error);
                    console.log(error);
                } else {
                    // TODO: Use the body object to extract OAuth access token
                    body = JSON.parse(body);
                    accessToken = body.access_token;
                    console.log(accessToken);
                }

            }
        )

        return accessToken;
    },
    // Function 2: generate ValidationURL
    generateValidationURL: function () {
        var accessToken = generateAcessToken();
        var request = require('request'),
            oauth_token = accessToken,
            url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
        auth = "Bearer " + oauth_token;

        request({
                method: 'POST',
                url: url,
                headers: {
                    "Authorization": auth
                },
                json: {
                    "ShortCode": "174379",
                    "ResponseType": "completed successfully!",
                    "ConfirmationURL": "/confirmation",
                    "ValidationURL": "/validation"
                }
            },
            function (error, response, body) {
                // TODO: Use the body object to extract the 
                body = JSON.parse(body)
                console.log(body);
            }
        )
    },
};

// var zemba = function () {
//     // create our webhook endpoint to recive webhooks from Safaricom
//     app.post('/hooks/mpesa', (req, res) => {

//         console.log('-----------Received M-Pesa webhook-----------');

//         // format and dump the request payload recieved from safaricom in the terminal
//         console.log(prettyjson.render(req.body, options));
//         console.log('-----------------------');

//         let message = {
//             "ResponseCode": "00000000",
//             "ResponseDesc": "success"
//         };

//         // respond to safaricom servers with a success message
//         res.json(message);
//     });
// }
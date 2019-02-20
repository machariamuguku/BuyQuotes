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
                body = JSON.parse(body);
                accessToken = body.access_token;

                if (error) {
                    console.log(error);
                } else {
                    // TODO: Use the body object to extract OAuth access token
                    body = JSON.parse(body);
                    accessToken = body.access_token;
                }

            }
        )
        console.log("method1"+accessToken);
        return accessToken;
    },
    // Function 2: generate ValidationURL
    generateValidationURL: function (accesstokn) {
        console.log("method21"+accesstokn);
        var request = require('request'),
            oauth_token = accesstokn,
            url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
        auth = "Bearer " + oauth_token;

        request({
                method: 'POST',
                url: url,
                headers: {
                    "Authorization": auth
                },
                json: {
                    "ShortCode": "601465",
                    "ResponseType": "completed",
                    "ConfirmationURL": "https://buyquotes.herokuapp.com/confirmation",
                    "ValidationURL": "https://buyquotes.herokuapp.com/confirmation/validation"
                }
            },
            function (error, response, body) {
                // TODO: Use the body object to extract the 
                console.log(body)
            }
        )

        //     let accessToken = generateAcessToken();
        //     var request = require('request'),
        //         oauth_token = accessToken,
        //         url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
        //     auth = "Bearer " + accessToken;

        //     request({
        //             method: 'POST',
        //             url: url,
        //             headers: {
        //                 "Authorization": auth
        //             },
        //             json: {
        //                 "ShortCode": "174379",
        //                 "ResponseType": "completed successfully!",
        //                 "ConfirmationURL": "/confirmation",
        //                 "ValidationURL": "/validation"
        //             }
        //         },
        //         function (error, response, body) {
        //             // TODO: Use the body object to extract the 
        //             body = JSON.stringify(body);
        //             console.log("method2 "+body);

        //         }
        //     )
        // },
    }
};
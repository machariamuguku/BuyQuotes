//Actual nodemailer file

const nodemailer = require("nodemailer");
const log4jslogger = require("./log4js");
require('dotenv').config();

/*
N/B: Get instructions to generate access tokens here 
--> https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1
ctrl+click to follow link
*/

// nodemailer method
let sendTheEmail = {
    // parse email address to send to and the actual message to send
    sendEmail: function (sendto, emailsubject, emailbody) {
        // set nodemailer transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                type: 'OAuth2',
                clientId: 'YOUR_CLIENT_ID_HERE',
                clientSecret: 'YOUR_CLIENT_SECRET_HERE'
            }
        });

        // send the email
        transporter.sendMail({
                // sender's email address (same as transporter's user)
                from: '"YOUR USERNAME" <your_address@gmail.com>',
                // list of receivers
                to: sendto,
                // The Email Subject
                subject: emailsubject,
                //The Email message (Email body)
                html: emailbody,
                auth: {
                    user: "your_address@gmail.com",
                    refreshToken: "YOUR_REFRESH_TOKEN_HERE",
                    accessToken: "YOUR_ACCESS_TOKEN_HERE",
                    expires: 3600
                }
            },
            (err, info) => {
                if (err) log4jslogger.info("#Email-400 .... There were errors sending email: " + err),
                    console.log("#Email-400 .... There were errors sending email: " + err);
                else
                    log4jslogger.info("#Email-200 .... Email successfully sent");
                console.log("Email successfully sent");
            });
    }
};
module.exports = sendTheEmail;
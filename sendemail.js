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
                clientId: '833392259723-ij0tsn3m6vi3kbtspq0nhtvcbcbgmmfq.apps.googleusercontent.com',
                clientSecret: '0il4HxucpWXGRJxVUzJdR-16'
            }
        });

        // send the email
        transporter.sendMail({
                // sender's email address (same as transporter's user)
                from: '"Macharia Muguku" <machariamuguku@gmail.com>',
                // list of receivers
                to: sendto,
                // The Email Subject
                subject: emailsubject,
                //The Email message (Email body)
                html: emailbody,
                auth: {
                    user: "machariamuguku@gmail.com",
                    refreshToken: "1/gk2_eNGDxf71iFzLIHSd0kfZ6fmUOUfwRRlAYpLIlx8-tiG4kkxX3tWb1JSu0dgb",
                    accessToken: "ya29.GlvDBotl6_i5Uaw1Q-U9sIecjeewkly6eVKQjbvTrKPxKYjaWAm6yhYdhiZ-ifli7YZtoLVJMsu2N1ZYR0mLqhrDzXJuUCddd-a8RBKPqJVjWGfi-oTP97Ko8RHr",
                    expires: 3600
                }
            },
            (err, info) => {
                if (err) log4jslogger.info("#400 .... There were errors sending email: " + err),
                    console.log(err);
                else console.log("Email successfully sent");
            });
    }
};
module.exports = sendTheEmail;
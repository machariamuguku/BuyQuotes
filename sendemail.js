var nodemailer = require("nodemailer");

// nodemailer method

let sendTheEmail = {
    sendEmail: function (towho, themessage) {
        // set nodemailer transport
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "mugukuwrites@gmail.com",
                pass: "@chiever#1"
            }
        });

        //  configure email preferences
        const mailOptions = {
            // sender address
            from: "mugukuwrites@gmail.com",
            // list of receivers
            to: towho,
            // to: "machariamuguku@gmail.com",
            // Subject line
            subject: "testing nodemailer",
            // plain text body
            html: themessage
            // html: "<p>am just testing nodemailer!</p>"
        };

        // send email
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err);
            else console.log("Email sent: " + info);
            // console.log('Email sent: ' + info.response);
        });
    }
}

module.exports = sendTheEmail;
var nodemailer = require("nodemailer");
// nodemailer method
let sendTheEmail = {
    // parse email address to send to and the actual message to send
    sendEmail: function (towho, themessage) {
        // set nodemailer transport
        var transporter = nodemailer.createTransport({
            service: "SendinBlue",
            auth: {
                user: "mugukuwrites@gmail.com",
                pass: "xjAyPEK9t32hL5vM"
            }
        });
        //  configure email preferences
        const mailOptions = {
            // sender's email address (same as transporter user)
            from: "mugukuwrites@gmail.com",
            // list of receivers
            to: towho,
            // The Email Subject
            subject: "testing nodemailer",
            //The Email message (Email body)
            html: themessage
        };

        // send the email
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) console.log(err);
            else console.log("Email successfully sent: " + info);
        });
    }
}

module.exports = sendTheEmail;
//Use this file to test Nodemailer
const getQuotes = require("./thequotes");

//change these
let quotecategory = Quotecategory.quotes;
let sendto = "email@domain.com"
let emailsubject = `Quotecategory Quotes: Delivered by buyquotes.herokuapp.com`;
//to here

let quotesobjects = getQuotes(quotecategory); //look at thequotes.js to understand the arguments
//call and set the email objects with response
const sendTheEmail = require("./sendemail.js"); //call sendemail.js
let emailbody = `<p>${quotesobjects}</p> <p>powered by: http://www.muguku.co.ke/</p>`; //set the email body
// Send the Email with The Quotes Here
sendTheEmail.sendEmail(sendto, emailsubject, emailbody);
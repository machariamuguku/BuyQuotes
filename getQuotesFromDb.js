/*
N/B: This file is not being used for now. 
I was initially getting the quotes from the DB 
but due to latency because of DB servers being in a different jurisdiction 
it caused delays.
I plan on reusing it since i've changed to servers in europe
(closer to Kenya than those in the USA)
*/


/*
      Get email address and quote category from the MongoDB object 
      and parse this to the send email method
    */
let emailobjects;
moongoseconn.collection("collectionName2").findOne({
  "mpesamethods.CheckoutRequestID": req.body.Body.stkCallback.CheckoutRequestID
}, (err, res) => {
  if (err) throw new Error(err.message, null);
  emailobjects = res;
  moongoseconn.collection("Quotes").findOne({
    // "quotecategory": emailobjects.quotecategory
    "quotecategory": "programming"
  }, (error, response) => {
    if (error) throw new Error(error.message, null);
    let quotesobjects = response.quotes; //array containing quote objects
    //set the email objects with response
    const sendTheEmail = require("./sendemail.js"); //call sendemail.js
    let sendto = emailobjects.email; //define send to variable
    let quotecategory = emailobjects.quotecategory;
    let emailsubject = (quotecategory + " " + "Quotes Delivered by buyquotes.herokuapp.com") //set email subject
    let emailbody = "<p>" + quotesobjects + "</p> <p>powered by: http://www.muguku.co.ke/</p>" //set the email body
    // Send the Email with The Quotes Here
    sendTheEmail.sendEmail(sendto, emailsubject, emailbody);
  });
});
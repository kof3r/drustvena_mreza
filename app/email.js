var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'bubbles.mislav',
        pass: 'harvard123'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Bubbles', // sender address
    to: 'emapenezic.ep@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hi ✔', // plaintext body
    html: '<b>#geek level over 9000 ✔</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});
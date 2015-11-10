
function sendVerificationEmail(email,link){
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    //moj email bubbbles.mislav@gmail.com
      service: 'Gmail',
      auth: {
          user: 'bubbles.mislav', //dodati svoj mail
          pass: 'harvard123'   //dodati svoju sifru
      }
  });
  var mailOptions = {
      from: 'Bubbles', // sender address
      to: email, // list of receivers
      subject: 'Just one more step to get started on Bubbles', // Subject line
      html: '<h3>To complete your Bubbles registration,please confirm your account.</h3>'+
        '<form action='+link+'><input type=\'submit\' value=\'Confirm your account\'></form>'// html body
  };

// send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);

  });
}
sendVerificationEmail("mislav.lukac@fer.hr","localhost:8080/emailverification?email="+"mislav.lukac@fer.hr");
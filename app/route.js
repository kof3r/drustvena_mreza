// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
// custom library
// model
var User = require('./models/user');

module.exports=function(app,passport){
   // GET
   app.get('/homepage', function(req, res, next) {
      if(!req.isAuthenticated()) {
         res.redirect('/');
      } else {
         var user = req.user;
         if(user !== undefined) {
            user = user.toJSON();
         }
         res.render('homepage', {title: 'Home', user: user});
      }
   });

// signin
// GET
   app.get('/', function(req, res, next) {
     if(req.isAuthenticated()) res.redirect('/homepage');
      res.render('index.ejs');
   });

// POST  
   app.post('/login.js', function(req, res, next) {
      passport.authenticate('local', { successRedirect: '/homepage',
                          failureRedirect: '/'}, function(err, user, info) {
         if(err) {
            return res.redirect('/');
         } 

         if(!user) {
            return res.redirect('/');
         }
         return req.logIn(user, function(err) {
            if(err) {
               return res.redirect('/');
            } else {
               return res.redirect('/homepage');
            }
         });
      })(req, res, next);
   });
// signup
// GET
   app.get('/signup', function(req, res, next) {
      if(req.isAuthenticated()) {
         res.redirect('/');
      } else {
         res.render('signup', {title: 'Sign Up'});
      }
   });
// POST
   app.post('/registration.js', function(req, res, next) {
      var user = req.body;
      var usernamePromise = new User({'username': user.username}).fetch();
      return usernamePromise.then(function(model) {
         if(model) {
            res.render('index', {title: 'signup', errorMessage: 'username already exists'});
         } else {
            var hash=User.generateHash(user.password);
            var newUser = new User({
               username : user.username,
               password_hash :hash,
               email : user.email,
               first_name : user.firstName,
               middle_name : user.middleName,
               last_name : user.lastName,
               confirmed : "unconfirmed"
            });


            newUser.save().then(function(model) {
               sendVerificationEmail(user.email,"localhost:8080/emailverification?id="+model.id+"&hash="+hash);
               res.redirect('/');
            });
         }
      });
   });
    
    app.get("/isUsernameAvailable", function(req, res, next) {
        new User({username: req.query.username}).fetch().then(function(model) {
            res.json({available:(model ? false : true)});
        });
    });
    
    app.get("/isEmailAvailable", function(req, res, next) {
        new User({email: req.query.email}).fetch().then(function(model) {
            res.json({available:(model ? false : true)});
        });
    });

    app.get("/emailverification",function(req,res,next){
      var id=req.query.id;
      var hash=req.query.hash;
      var usernamePromise = new User({'id': id}).fetch();
      return usernamePromise.then(function(model) {
        if(model.toJSON().password_hash===hash){
            model.save({confirmed:"confirmed"}).then(function(model){
                res.render('emailverification.ejs', {username: model.username});
            });  
          }
      });
    });

// logout
// GET
   app.get('/sign-out', function(req, res, next) {
      if(!req.isAuthenticated()) {
         notFound404(req, res, next);
      } else {
         req.logout();
         res.redirect('/');
      }
   });

/********************************/
// Partial HTML views
// GET
	app.get('/partial/new-post', function(req, res, next) {
		res.render('new-post.partial.ejs');
	});
	app.get('/partial/feed', function(req, res, next) {
		res.render('feed.partial.ejs');
	});
	app.get('/partial/view-profile', function(req, res, next) {
		res.render('view-profile.partial.ejs');
	});
/********************************/
// 404 not found
   app.use(function(req, res, next) {
       res.status(404);
      res.render('404', {title: '404 Not Found'});
   });

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

}




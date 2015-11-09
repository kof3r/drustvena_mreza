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
            var newUser = new User({
               username : user.username,
               password_hash : User.generateHash(user.password),
               email : user.email,
               first_name : user.firstName,
               middle_name : user.middleName,
               last_name : user.lastName
            });

            newUser.save().then(function(model) {
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

/********************************/
// 404 not found
   app.use(function(req, res, next) {
       res.status(404);
      res.render('404', {title: '404 Not Found'});
   });
};
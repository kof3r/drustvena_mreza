var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Country = require('../models/country');
var Mail=require('../config/mail');


module.exports = function(passport){

    router.use('/api', require('./api'));
    router.use('/home', require('./home'));
    router.use('/search', require('./search'));
    router.use('/content', require('./content'));
    router.use('/profile', require('./profile'));

// index - sign in and sign up
// GET
    router.get('/', function(req, res, next) {
        if(req.isAuthenticated()){
            res.redirect('/home/homepage');
        }
        else {
            res.render('index.ejs');
        }
    });
// GET
    router.get('/sign-in', function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/home/homepage');
        }
        else {
            res.render('index.ejs', {title: 'Sign in', signIn: true});
        }
    });
// POST
    router.post('/sign-in', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if(err) {
                return res.render('index.ejs', {loginError:'An error occoured.'});
            }

            if(!user) {
                return res.render('index.ejs', {loginError:'Invalid login attempt.'});
            }
            
            return req.logIn(user, function(err) {
                if(err) {
                    return res.render('index', {title: 'Sign in', loginError:'An error occoured.'});
                } else {
                    return res.redirect('/home/homepage');
                }
            });
        })(req, res, next);
    });
    
// sign up
// GET
    router.get('/sign-up', function(req, res, next) {
        if(req.isAuthenticated()){
            res.redirect('/home/homepage');
        }
        else {
            res.render('index.ejs', {title: 'Sign up', signUp: true});
        }
    });
// POST
    router.post('/sign-up', function(req, res, next) {
        var form = req.body;
        var country_id;
        Promise.all([
            Promise.resolve(!/^[a-zA-Z][a-zA-Z0-9_-]{2,30}$/.test(form.username) ? 'Username must begin with an alphabetic character, be between 3 and 8 characters in length, contain only alphanumerics, underscores and hyphens' : null),
            Promise.resolve(!/^[A-Za-z0-9_-]{8,30}$/.test(form.password) ? 'Password must be between 8 and 18 characters in length, contain only alphanumerics, underscores and hyphens' : null),
            Promise.resolve(!/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(form.email) ? 'invalid email' : null),
            User.where({username: form.username}).fetch().then(function (user) {
                return Promise.resolve(user ? 'Username already exists' : null);
            }),
            User.where({email: form.email}).fetch().then(function (user) {
                return Promise.resolve(user ? 'E-mail already exists' : null);
            }),
            Country.where({name: form.country}).fetch().then(function (country) {
                coutry_id = country ? country.id : null;
                return Promise.resolve(form.country ? (country ? null : 'Country does not exist') : null);
            })
        ]).then(function(errorMessages) {
            var error = [];
            errorMessages.forEach(function (message) {
                if(message) {
                    error.push(message);
                }
            });
            if(error.length === 0) {
                var hash = User.generateHash(form.password);
                User.forge({
                    username : form.username,
                    email : form.email,
                    password_hash : hash,
                    confirmed : false,
                    first_name : form.firstName || null,
                    last_name : form.lastName || null,
                    middle_name : form.middleName || null,
                    address : form.address || null,
                    city : form.city || null,
                    country_id : country_id
                }).save().then(function (user) {
                    Mail.sendVerificationEmail(form.email, "localhost:8080/emailverification?id=" + user.id + "&hash=" + hash);
                    res.render('sign-up-successful.ejs', {title: 'Confirm account', data: form});
                })
            } else {
                res.render('index', {title: 'Sign up', signUp: true, registerError: error, registrationInput: form});
            }
        }).catch(function (err) {
            console.log(err);
        });
    });

    router.get("/isUsernameAvailable", function(req, res, next) {
        new User({username: req.query.username}).fetch().then(function(model) {
            res.json({available:(model ? false : true)});
        });
    });

    router.get("/isEmailAvailable", function(req, res, next) {
        new User({email: req.query.email}).fetch().then(function(model) {
            res.json({available:(model ? false : true)});
        });
    });

    router.get("/emailverification",function(req,res,next){
        var id=req.query.id;
        var hash=req.query.hash;
        var usernamePromise = new User({'id': id}).fetch();
        return usernamePromise.then(function(model) {
            if(model.toJSON().password_hash===hash){
                model.save({confirmed : 1}).then(function(model){
                    res.render('emailverification.ejs', {username: model.toJSON().username});
                });
            }
        });
    });

// sign out
// POST
    router.post('/sign-out', function(req, res, next) {
        if(!req.isAuthenticated()) {
            notFound404(req, res, next);
        } else {
            req.logout();
            res.redirect('/');
        }
    });

    router.get('/test', function(req, res, next) {
        var User = require('../models/user');
        User.where({username : 'user'}).fetch({withRelated : 'bubbles'}).then(function (user) {
            user.related('bubbles').forEach(function (bubble) {
               bubble.fetch({withRelated : 'contents'}).then(function (bubble) {
                  bubble.related('contents').forEach(function (content) {
                      console.log(JSON.stringify(content) + '\n');
                  });
               });
            });
        });
        res.end();
    });
    
// Partial HTML views
// GET
router.get('/partial/new-post', function(req, res, next) {
    res.render('new-post.partial.ejs');
});
router.get('/partial/feed', function(req, res, next) {
    res.render('feed.partial.ejs');
});
router.get('/partial/view-profile', function(req, res, next) {
    res.render('view-profile.partial.ejs');
});
router.get('/partial/edit-profile', function(req, res, next) {
    res.render('edit-profile.partial.ejs');
});
router.get('/partial/magange-account', function(req, res, next) {
    res.render('manage-account.partial.ejs');
});

    /********************************/
// 404 not found
    router.use(function(req, res, next) {
        res.status(404);
        res.render('404', {title: '404 Not Found'});
    });
    return router;
};

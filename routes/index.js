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

// signin
// GET
    router.get('/', function(req, res, next) {
        if(req.isAuthenticated()){
            res.redirect('/home/homepage');
        }
        else {
            res.render('index.ejs', {loginError:'', registerError:''});
        }
    });

// POST
    router.post('/login.js', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if(err) {
                return res.render('index.ejs', {loginError:'An error occoured.', registerError:''});
            }

            if(!user) {
                return res.render('index.ejs', {loginError:'Invalid login attempt.', registerError:''});
            }
            
            return req.logIn(user, function(err) {
                if(err) {
                    return res.render('index', {loginError:'An error occoured.', registerError:''});
                } else {
                    return res.redirect('/home/homepage');
                }
            });
        })(req, res, next);
    });
// signup
// GET
    router.get('/signup', function(req, res, next) {
        if(req.isAuthenticated()) {
            res.redirect('/');
        } else {
            res.render('signup', {title: 'Sign Up'});
        }
    });
// POST
    router.post('/registration.js', function(req, res, next) {
        var user = req.body;
        var country_id;
        Promise.all([
            Promise.resolve(!/^[a-z][a-z0-9_-]{2,15}$/.test(user.username) ? 'username must begin with an alphabetic character, be between 3 and 8 characters in length, contain only alphanumerics, underscores and hyphens' : ''),
            Promise.resolve(!/^[a-z0-9_-]{8,18}$/.test(user.password) ? 'password must be between 8 and 18 characters in length, contain only alphanumerics, underscores and hyphens' : ''),
            Promise.resolve(!/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(user.email) ? 'invalid email' : ''),
            User.where({username: user.username}).fetch().then(function (user) {
                if(user) {
                    return Promise.resolve('username already exists');
                }
                return Promise.resolve('');
            }),
            User.where({email: user.email}).fetch().then(function (user) {
                if(user) {
                    return Promise.resolve('email already exists');
                }
                return Promise.resolve('');
            }),
            Country.where({name: user.country}).fetch().then(function (country) {
                if(!country) {
                    return Promise.resolve('country does not exist');
                }
                country_id = country.id;
                return Promise.resolve('');
            })
        ]).then(function(errorMessages) {
            var error = [];
            errorMessages.forEach(function (message) {
                if(message !== '') {
                    error.push(message);
                }
            })
            if(error.length === 0) {
                var hash = User.generateHash(user.password);
                User.forge({
                    username : user.username,
                    email : user.email,
                    password_hash : hash,
                    first_name : user.firstName === '' ? null : user.firstName,
                    middle_name : user.middleName === '' ? null : user.middleName,
                    last_name : user.lastName === '' ? null : user.lastName,
                    address : user.address === '' ? null : user.address,
                    city : user.city === '' ? null : user.city,
                    country_id : country_id
                }).save().then(function (model) {
                    Mail.sendVerificationEmail(user.email, "localhost:8080/emailverification?id=" + model.id + "&hash=" + hash);
                    res.redirect('/#successful-sign-up');
                })
            } else {
                res.render('index', {title: 'Sign up', loginError: '', registerError: error});
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

// logout
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

    /********************************/
// 404 not found
    router.use(function(req, res, next) {
        res.status(404);
        res.render('404', {title: '404 Not Found'});
    });
    return router;
};

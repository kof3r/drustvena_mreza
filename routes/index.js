
var express = require('express');
var router = express.Router();

var Mail=require('../config/mail');
var Checkit = require('checkit');
var Promise = require('bluebird');

var User = require('../models/user');
var Country = require('../models/country');

module.exports = function(passport){

    router.use('/api', require('./api'));
    router.use('/home', require('./home'));
    router.use('/search', require('./search'));
    router.use('/content', require('./content'));
    router.use('/partial', require('./partial'));
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
        Country.where({name: form.country}).fetch().then(function (country) {
            country_id = country ? country.id : null;
        }).then(function() {
            return User.forge({
                username : form.username,
                email : form.email,
                password_hash : form.password,
                first_name : form.firstName || null,
                last_name : form.lastName || null,
                middle_name : form.middleName || null,
                address : form.address || null,
                city : form.city || null,
                country_id : country_id
            }).save().then(function (user) {
                var email = user.get('email');
                var id = user.get('id');
                var hash = user.get('password_hash');
                Mail.sendVerificationEmail(email, "localhost:8080/emailverification?id=" + id + "&hash=" + hash);
                res.render('sign-up-successful.ejs', {title: 'Confirm account', data: form});
            })
        }).catch(Checkit.Error, function(err) {
            var error = [];
            err.forEach(function (val, key) {
                val.forEach(function(message) {
                    error.push(message);
                })
            });
            res.render('index', {title: 'Sign up', signUp: true, registerError: error, registrationInput: form});
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
    

    /********************************/
// 404 not found
    router.use(function(req, res, next) {
        res.status(404);
        res.render('404', {title: '404 Not Found'});
    });
    return router;
};

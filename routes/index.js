var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Mail=require('../public/javascripts/mail')


module.exports = function(passport){

// signin
// GET
    router.get('/', function(req, res, next) {
        if(req.isAuthenticated()){
            res.redirect('/homepage');
        }
        else {
            res.render('index.ejs');
        }
    });

// POST
    router.post('/login.js', function(req, res, next) {
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
                    Mail.sendVerificationEmail(user.email,"localhost:8080/emailverification?id="+model.id+"&hash="+hash);
                    res.redirect('/');
                });
            }
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
                model.save({confirmed:"confirmed"}).then(function(model){
                    res.render('emailverification.ejs', {username: model.username});
                });
            }
        });
    });

// logout
// GET
    router.get('/sign-out', function(req, res, next) {
        if(!req.isAuthenticated()) {
            notFound404(req, res, next);
        } else {
            req.logout();
            res.redirect('/');
        }
    });

    /********************************/
// 404 not found
    router.use(function(req, res, next) {
        res.status(404);
        res.render('404', {title: '404 Not Found'});
    });
    return router;
};


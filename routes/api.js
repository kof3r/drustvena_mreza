/**
 * Created by Mislav on 11/27/2015.
 */
var express = require('express');
var router = express.Router();

var User = require('../models/user');

module.exports=function (passport) {

    router.post('/sign-up', function(req, res, next) {
        var form = req.body;
        User.forge({
            username: form.username,
            email: form.email,
            password_hash: form.password,
            first_name: form.firstName,
            last_name: form.lastName,
            middle_name: form.middleName,
            address: form.address,
            city: form.city,
            country_name: form.country
        }).save().then(function (user) {
            res.end();
        }, function(error) {
            res.json({errors: error.messages});
        });
    });

    router.post('/sign-in', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if(err) {
                return res.json({error:'An error occurred.'});
            }

            if(!user) {
                return res.json({error:'Invalid login attempt.'});
            }

            req.logIn(user, function(err) {
                if(err) {
                    return res.json({error:'An error occurred.'});
                } else {
                    return res.end();
                }
            });
        })(req, res, next);
    });

    router.post('/sign-out', function(req, res, next) {
        if(!req.isAuthenticated()) {
            notFound404(req, res, next);
        } else {
            req.logout();
            res.end(200);
        }
    });

    return router;
};
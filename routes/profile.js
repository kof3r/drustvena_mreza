/**
 * Created by Zeljko on 5/11/2015.
 */

var express = require('express');
var router = express.Router();

var ValidationError = require('../models/errors/validationError.js');

var User = require('../models/user');

var requireAuthentication = require('../utils/authentication');

router.all('*' , requireAuthentication);

router.get('/view', function(req, res, next) {
    res.render('view-profile.ejs', {user: req.user.toJSON()});
});

router.get('/edit', function(req, res, next) {
    res.render('edit-profile.ejs', {user: req.user.toJSON()});
});

router.post('/edit', function(req, res, next) {

    var user = req.user;
    var form = req.body;

    user.set('first_name', form.firstName);
    user.set('last_name', form.lastName);
    user.set('middle_name', form.middleName);
    user.set('country_name', form.country);
    user.set('city', form.city);
    user.set('address', form.address);
    user.set('relationship_status_id', form.relationshipStatusId);
    user.save().then(function (user) {
        res.render('edit-profile.ejs', {user: user.toJSON()});
    }).catch(ValidationError, function (error) {
        res.render('edit-profile.ejs', {user: error.user.toJSON(), editProfileError: error.messages});
    })
});

module.exports=router;
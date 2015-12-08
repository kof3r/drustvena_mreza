/**
 * Created by Zeljko on 5/11/2015.
 */

var express = require('express');
var router = express.Router();

var User = require('../models/user');

var requireAuthentication = require('../utils/authentication');

router.all('*' , requireAuthentication);

router.get('/view', function(req, res, next) {
    res.render('view-profile.ejs', {user: req.user.toJSON()});
});

router.get('/edit', function(req, res, next) {
    res.render('edit-profile.ejs', {user: req.user.toJSON()});
});

module.exports=router;
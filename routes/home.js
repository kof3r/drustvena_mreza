/**
 * Created by Mislav on 11/27/2015.
 */
var User = require('../models/user');

var express = require('express');
var router = express.Router();

var requireAuthentication = require('../utils/authentication');

router.all('*', requireAuthentication);

router.get('/homepage', function(req, res, next) {
    res.render('homepage.ejs', {title: 'Home', user: req.user.toJSON()});
});

module.exports=router;
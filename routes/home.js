/**
 * Created by Mislav on 11/27/2015.
 */
var User = require('../models/user');

var express = require('express');
var router = express.Router();
/********************************/
// GET
router.get('/homepage', function(req, res, next) {
    if(!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        var user = req.user;
        if(user !== undefined) {
            user = user.toJSON();
        }
        res.render('homepage.ejs', {title: 'Home', user: user});
    }
});

module.exports=router;
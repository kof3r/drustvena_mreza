/**
 * Created by �eljko on 5/11/2015.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.all('*' , function (req, res, next) {
    if(!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        next();
    }
});

router.get('/view', function(req, res, next) {
    res.render('view-profile.ejs', {user: req.user});
});

router.post('/edit', function(req, res, next) {
    res.render('edit-profile.ejs', {user: req.user});
});

module.exports=router;
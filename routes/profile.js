/**
 * Created by Željko on 5/11/2015.
 */

var express = require('express');
var router = express.Router();
var User = require('../models/user');
/********************************/

// view
// GET
router.get('/view', function(req, res, next) {
    if(req.isAuthenticated()) {
        var user = req.user;
        if(user !== undefined) {
            user = user.toJSON();
        }
        res.render('view-profile.ejs', {user: user});
    }
    else {
        res.redirect('/');
    }
});

// edit
// GET
router.post('/edit', function(req, res, next) {
    if(req.isAuthenticated()) {
        var user = req.user;
        if(user !== undefined) {
            user = user.toJSON();
        }
        res.render('edit-profile.ejs', {user: user});
    }
    else {
        res.redirect('/');
    }
});

module.exports=router;
var express = require('express');
var router = express.Router();

var User = require('../models/user');

var requireAuthentication = require('../utils/authentication');
router.all('*' , requireAuthentication);

// GET
router.get('/feed', function(req, res, next) {
    res.render('feed.partial.ejs');
});
router.get('/new-bubble', function(req, res, next) {
    res.render('new-bubble.partial.ejs');
});
router.get('/new-content', function(req, res, next) {
    res.render('new-content.partial.ejs');
});
router.get('/view-profile', function(req, res, next) {
    res.render('view-profile.partial.ejs');
});
router.get('/edit-profile', function(req, res, next) {
    res.render('edit-profile.partial.ejs', {user: req.user.toJSON()});
});
router.get('/manage-account', function(req, res, next) {
    res.render('manage-account.partial.ejs');
});

module.exports=router;
/**
 * Created by Mislav on 11/27/2015.
 */
var Country = require('../models/relationship_status')

var express = require('express');
var router = express.Router();
<<<<<<< HEAD
/********************************/
// Partial HTML views
// GET
router.get('/partial/new-post', function(req, res, next) {
    res.render('new-post.partial.ejs');
});
router.get('/partial/feed', function(req, res, next) {
    res.render('feed.partial.ejs');
});
router.get('/partial/view-profile', function(req, res, next) {
    res.render('view-profile.partial.ejs');
});
router.get('/partial/edit-profile', function(req, res, next) {
    res.render('edit-profile.partial.ejs');
});
// GET
=======

var requireAuthentication = require('../utils/authentication');

router.all('*', requireAuthentication);

>>>>>>> 88e216b1f6c02e9c13e4a5f2c7b0ee33f2743b73
router.get('/homepage', function(req, res, next) {
    res.render('homepage.ejs', {title: 'Home', user: req.user.toJSON()});
});

module.exports=router;
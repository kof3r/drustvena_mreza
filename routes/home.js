/**
 * Created by Mislav on 11/27/2015.
 */
var express = require('express');
var router = express.Router();
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
// GET
router.get('/homepage', function(req, res, next) {
    if(!req.isAuthenticated()) {
        res.redirect('/');
    } else {
        var user = req.user;
        if(user !== undefined) {
            user = user.toJSON();
        }
        res.render('homepage', {title: 'Home', user: user});
    }
});
module.exports=router;
var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Bubble = require('../models/bubble');

var contUtils = require('../utils/content');
var Promise = require('bluebird');

var requireAuthentication = require('../utils/authentication');
router.all('*' , requireAuthentication);

// GET
router.get('/feed', function(req, res, next) {
    res.render('feed.partial.ejs');
});
router.get('/new-bubble', function(req, res, next) {
    res.render('bubble-editor.partial.ejs');
});
router.get('/edit-bubble/:id', function(req, res, next) {
    Bubble.where({id: req.params.id}).fetch().then(function(bubble){
      res.render('bubble-editor.partial.ejs', {bubble: bubble.toJSON()});
    });
});
router.get('/messages', function(req, res, next) {
    res.render('messages.partial.ejs');
});
router.get('/new-content', function(req, res, next) {
    res.render('content-editor.partial.ejs');
});
router.get('/edit-content/:id', function(req, res, next) {
    Promise.join(
        contUtils.getPost(req.params.id),
        function(_post){
            if (!_post){
                return res.render('content-editor.partial.ejs', {error: 'Content does not exist'});
            }

            console.log('tu sam');

            return res.render('content-editor.partial.ejs', {post: _post.toJSON()});
        }
    )
});
router.get('/view-profile', function(req, res, next) {
    User.query(function(qb) {
        qb.join('country', 'user.country_id', 'country.id')
            .where('user.id', req.user.id);
    }).fetch({columns: ['user.*', 'country.name as country_name']}).then(function (user) {
        user.set('isMyProfile', true);
        res.render('view-profile.partial.ejs', {user: user.toJSON()});
    })
    /**
    User.where({id: req.user.id}).fetch().then(function (user) {
        var userToReturn = user.attributes;
        userToReturn['isMyProfile'] = true;
        res.render('view-profile.partial.ejs', {user: userToReturn});
    })
     */
});
router.get('/view-profile/:username', function(req, res, next) {
    User.where({username: req.params.username}).fetch().then(function (user) {
        var userToReturn = user.attributes;
        // hide sensitive info
        if (user.attributes.id != req.user.attributes.id){
            userToReturn['password_hash'] = undefined;
            userToReturn['email'] = undefined;
            userToReturn['isMyProfile'] = false;
        } else {
            userToReturn['isMyProfile'] = true;
        }
        res.render('view-profile.partial.ejs', {user: userToReturn});
    })
});
router.get('/edit-profile', function(req, res, next) {
    User.query(function(qb) {
        qb.join('country', 'user.country_id', 'country.id')
            .where('user.id', req.user.id);
    }).fetch({columns: ['user.*', 'country.name as country_name']}).then(function (user) {
        res.render('edit-profile.partial.ejs', {user: user.toJSON()});
    })
});
// nova slika
router.get('/edit-image/', function(req, res, next) {
    res.render('edit-image.partial.ejs', {user: req.user.toJSON()});
});
// uređivanje postojeće
router.get('/edit-image/:id', function(req, res, next) {
    res.render('edit-image.partial.ejs', {user: req.user.toJSON()});
});
router.get('/manage-account', function(req, res, next) {
    res.render('manage-account.partial.ejs');
});

// 404
router.get('/404', function(req, res, next) {
    res.render('404.partial.ejs');
});

module.exports=router;
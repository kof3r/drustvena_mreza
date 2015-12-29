/**
 * Created by Gordan on 15.12.2015..
 */

var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Privilege = require('../models/privilege');
var Content = require('../models/content');
var Bubble = require('../models/bubble');

var general = require('../utils/general');
var requireAuthentication = require('../utils/authentication');

router.all('*', requireAuthentication);

router.get('/isContact', function (req, res) {
    Privilege.where({permittee_id: req.user.get('id'), permitter_id: req.query.id}).fetch().then(function (privilege) {
        res.json({isContact: (privilege ? true : false)});
    });
});

router.get('/info', function (req, res) {
    User.where({id: req.query.id}).fetch().then(function (user) {
        res.json(user);
    });
});

router.post('/contactRequest', function (req, res, next) {
    Privilege.forge({permittee_id: req.user.get('id'), permitter_id: req.body.user_id}).save().then(function () {
        res.end();
    })
});

router.post('/removeContact', function (req, res) {
    Privilege.where({permittee_id: req.user.get('id'), permitter_id: req.body.user_id}).destroy().then(function () {
        res.end();
    })
});

router.post('/avatar/:id', function (req, res, next) {
    Content.where({id: req.params.id, content_type_id: 2}).fetch().then(function(content) {
        if (!content) {
            return general.sendMessage(res, "This image doesn't exist or it was deleted!", 404);
        }

        Bubble.where({id: content.attributes.bubble_id}).fetch().then(function (bubble) {
            if (!req.isAuthenticated() || bubble.attributes.user_id != req.user.id) {
                return general.sendMessage(res, "Only your own images can be used as your avatars!", 403)
            }

            req.user.set('avatar', content.attributes.content);
            req.user.save().then(function(user, err){
                if (err){
                    console.log(err);
                    res.status(500).json(user);
                }

                res.status(200).json(user);
            });
        });
    });
});

router.get('/contacts', function(req, res, next) {
    Privilege.query(function(qb) {
        qb.join('user', 'privilege.permitter_id', 'user.id')
            .where('privilege.permittee_id', req.query.id || req.user.get('id'))
            .orderBy('username', 'ASC')
    }).fetchAll({columns: ['user.id', 'username', 'first_name', 'last_name', 'middle_name', 'avatar']}).then(function (contacts) {
        res.json({contacts: contacts});
    }).catch(function(error) {
        console.log(error);
    });
});

router.get('/nonFriends', function(req, res) {
    var id = req.user.id;

    Privilege.where({permittee_id: id}).fetchAll().then(function (friends) {
        return Promise.resolve(friends.map(function(friend) {
            return friend.get('permitter_id');
        }))
    }).then(function (friendIds) {
        friendIds.push(id);
        return User.query(function (qb) {
            qb.whereNotIn('id', friendIds);
        }).fetchAll();
    }).then(function (nonFriends) {
        res.json({response: nonFriends});
    });
});

router.get('/bubbles', function(req, res) {
    //  privatnost: Moguće zatražiti bubble-ove usera koji session holderu nisu dali dopuštenje.
    var user_id = req.query.user_id;
    Bubble.where({user_id: user_id}).fetchAll().then(function (bubbles) {
        res.json({bubbles: bubbles});
    });
});

module.exports=router;
/**
 * Created by Mislav on 11/27/2015.
 */
var User = require('../models/user');
var Bubble = require('../models/bubble');
var Content = require('../models/content');
var Privilege = require('../models/privilege')

var express = require('express');
var router = express.Router();

var requireAuthentication = require('../utils/authentication');

router.all('*', requireAuthentication);

router.get('/homepage', function(req, res, next) {
    res.render('homepage.ejs', {title: 'Home', user: req.user.toJSON()});
});

router.get('/feed', function(req, res) {
    Privilege.query(function (qb) {
        qb.join('bubble', 'privilege.permitter_id', 'bubble.user_id')
            .join('content', 'content.bubble_id', 'bubble.id')
            .leftJoin('like', 'content.id', 'like.content_id')
            .where('privilege.permittee_id', req.user.id)
            .columns('content.*')
            .groupBy('bubble_id', 'id', 'created_at', 'updated_at', 'title', 'content', 'description')
            .count('like.user_id as likes').union(function () {
                this.from('bubble')
                    .join('content', 'content.bubble_id', 'bubble.id')
                    .leftJoin('like', 'content.id', 'like.content_id')
                    .where('bubble.user_id', req.user.id)
                    .columns('content.*')
                    .groupBy('bubble_id', 'id', 'created_at', 'updated_at', 'title', 'content', 'description')
                    .count('like.user_id as likes')
                    .orderBy('created_at', 'DESC');
            })
    }).fetchAll().then(function (contents) {
        res.json({contents: contents});
    }).catch(function (error) {
        console.log(error.stack);
    });
});

module.exports=router;
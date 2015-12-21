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
    var user = req.user;

    Privilege.query(function (qb) {
        qb.join('bubble', 'privilege.permitter_id', 'bubble.user_id')
            .join('content', 'content.bubble_id', 'bubble.id')
            .join('user', 'bubble.user_id', 'user.id')
            .leftJoin('like', 'content.id', 'like.content_id')
            .leftJoin('like as myLike', function() {
                this.on('like.content_id', 'myLike.content_id').andOn('like.user_id', 'myLike.user_id').andOn('like.user_id', user.get('id'));
            })
            .leftJoin('dislike', 'content.id', 'dislike.content_id')
            .leftJoin('dislike as myDislike', function() {
                this.on('dislike.content_id', 'myDislike.content_id').andOn('dislike.user_id', 'myDislike.user_id').andOn('dislike.user_id', user.get('id'));
            })
            .where('privilege.permittee_id', req.user.id)
            .columns('content.*', 'user.username')
            .groupBy('bubble_id', 'id', 'created_at', 'updated_at', 'title', 'content', 'description', 'username')
            .count('like.user_id as likes')
            .count('dislike.user_id as dislikes')
            .count('myLike.user_id as iLike')
            .count('myDislike.user_id as iDislike').union(function () {
                this.from('bubble')
                    .join('content', 'content.bubble_id', 'bubble.id')
                    .join('user', 'bubble.user_id', 'user.id')
                    .leftJoin('like', 'content.id', 'like.content_id')
                    .leftJoin('like as myLike', function() {
                        this.on('like.content_id', 'myLike.content_id').andOn('like.user_id', 'myLike.user_id').andOn('like.user_id', user.get('id'));
                    })
                    .leftJoin('dislike', 'content.id', 'dislike.content_id')
                    .leftJoin('dislike as myDislike', function() {
                        this.on('dislike.content_id', 'myDislike.content_id').andOn('dislike.user_id', 'myDislike.user_id').andOn('dislike.user_id', user.get('id'));
                    })
                    .where('bubble.user_id', req.user.id)
                    .columns('content.*', 'user.username')
                    .groupBy('bubble_id', 'id', 'created_at', 'updated_at', 'title', 'content', 'description', 'username')
                    .count('like.user_id as likes')
                    .count('dislike.user_id as dislikes')
                    .count('myLike.user_id as iLike')
                    .count('myDislike.user_id as iDislike')
                    .orderBy('created_at', 'DESC');
            })
    }).fetchAll().then(function (contents) {
        res.json({contents: contents});
    }).catch(function (error) {
        console.log(error.stack);
    });
});

module.exports=router;
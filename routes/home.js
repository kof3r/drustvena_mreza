/**
 * Created by Mislav on 11/27/2015.
 */

var knex = require('../config/knex');
var Promise = require('bluebird');

var User = require('../models/user');
var Bubble = require('../models/bubble');
var Content = require('../models/content');
var Privilege = require('../models/privilege')

var express = require('express');
var router = express.Router();

var requireAuthentication = require('../utils/authentication');

router.all('*', requireAuthentication);

router.get('/feed', function(req, res) {
    var user_id = req.user.id;

    var contentQuery = knex.from(function() {
        this.union(function () {
            this.from('privilege')
                .where('permittee_id', user_id)
                .column('permitter_id as id')
        }).union(function () {
            this.select(knex.raw('? as id', [user_id]))
        }).as('friendsAndMe')
    }).joinRaw('join bubble on bubble.user_id = friendsAndMe.id and bubble_type_id <> 2')
        .joinRaw('join user on bubble.user_id = user.id')
        .joinRaw('join content on bubble.id = content.bubble_id');

    var appendLikes = require('../db/query/likeCounter');

    appendLikes(contentQuery, user_id)
        .column('user.id as user_id', 'username', 'avatar','content.bubble_id', 'content.id', 'content.content_type_id', 'content.created_at', 'content.updated_at', 'content.title', 'content.content', 'content.description')
        .orderBy('created_at', 'DESC')
        .then(function (contents) {
            res.json({contents: contents});
        })
});

module.exports=router;
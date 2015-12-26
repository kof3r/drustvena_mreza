/**
 * Created by Gordan on 14.12.2015..
 */

var ValidationError = require('../models/errors/validationError');

var knex = require('../config/knex');

var express = require('express');
var router = express.Router();
var general = require('../utils/general');

var Bubble = require('../models/bubble');
var Content = require('../models/content');

router.all("*", require('../utils/authentication'));

router.post('/create', function(req, res) {
    var form = req.body;
    var user = req.user;

    Bubble.forge({
        user_id: user.get('id'),
        bubble_type_id: 3,
        title: form.title,
        description: form.description
    }).save().then(function (bubble) {
        res.json(bubble);
    }).catch(ValidationError, function (error) {
        res.status(400).json({errors: error.messages});
    })
});

router.post('/edit/:id', function(req, res) {
    var user = req.user;
    var form = req.body;

    Bubble.where({id: req.params.id}).fetch().then(function (bubble) {

        if(!bubble) { res.status(404).json({error: 'Requested bubble does not exist.'}) }
        else if(!bubble.ownedBy(user)) { res.status(403).json({error: 'You don\'t have permission to edit this bubble.'}) }
        else {
            bubble.set('title', form.title);
            bubble.set('description', form.description);
            return bubble.save();
        }

    }).then(function (bubble) {
        res.json(bubble);
    }).catch(ValidationError, function (error) {
        res.status(400).json({errors: error.messages});
    });
});

router.get('/:id/content', function (req, res) {
    var bubble_id = req.params.id;
    var user_id = req.user.get('id');

    knex.raw('select content.bubble_id, content.id, content.content_type_id, content.created_at, content.updated_at, content.title, content.content, COUNT(likes) as likes, COUNT(dislikes) as dislikes, COUNT(DISTINCT iLikeDislike.iLike) as iLike, COUNT(DISTINCT iLikeDislike.iDislike) as iDislike '
        + ' from content '
        + ' left join ( '
        +   ' SELECT `like`.user_id as likes, dislike.user_id as dislikes, `like`.content_id FROM `like` '
        +   ' LEFT JOIN dislike ON `like`.content_id = dislike.content_id AND `like`.user_id = dislike.user_id '
        +   ' UNION '
        +   ' SELECT `like`.user_id as likes, dislike.user_id as dislikes, dislike.content_id FROM dislike '
        +   ' LEFT JOIN `like` ON `like`.content_id = dislike.content_id AND `like`.user_id = dislike.user_id '
        + ' ) as likeCount on likeCount.content_id = content.id '
        + ' left join ( '
        +   ' SELECT `like`.user_id as iLike, dislike.user_id as iDislike, `like`.content_id FROM `like` '
        +   ' LEFT JOIN dislike ON `like`.content_id = dislike.content_id AND `like`.user_id = dislike.user_id '
        +   ' UNION '
        +   ' SELECT `like`.user_id as likes, dislike.user_id as dislikes, dislike.content_id FROM dislike '
        +   ' LEFT JOIN `like` ON `like`.content_id = dislike.content_id AND `like`.user_id = dislike.user_id '
        + ' ) as iLikeDislike on iLikeDislike.content_id = content.id and ((iLikeDislike.iLike = likeCount.likes and iLikeDislike.iLike = ' + user_id + ') or (iLikeDislike.iDislike = likeCount.dislikes and iLikeDislike.iDislike = ' + user_id +'))'
        + ' where content.bubble_id = ' + bubble_id
        + ' group by content.bubble_id, content.id, content.content_type_id, content.created_at, content.updated_at, content.title, content.content'
        + ' order by content.created_at DESC').then(function (posts) {
        res.json( {posts: posts[0]} );
    }).catch(function(error) {
        console.log(error);
    });

    /**
    Bubble.where({id: req.params.id}).fetch().then(function(bubble, err){
        if (!bubble || err){
            console.log(err);
            return general.sendMessage(res, "This bubble doesn't exist or it was deleted", 404);
        }
        Content.where({bubble_id: req.params.id}).fetchAll().then(function (contents) {
            res.json({attributes: bubble.attributes, contents: contents});
        })

    });
     */
});

router.get('/:id', function (req, res) {
    Bubble.where({id: req.params.id}).fetch().then(function(bubble, err){
        if (!bubble || err){
            console.log(err);
            return general.sendMessage(res, "This bubble doesn't exist or it was deleted", 404);
        }

        res.json(bubble);
    })
});


module.exports = router;
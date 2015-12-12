/**
 * Created by Domagoj on 5.12.2015..
 */
/**
 * Created by Domagoj on 3.12.2015..
 */
var express = require('express');
var router = express.Router();

var Content = require('../models/content');
var Bubble = require('../models/bubble');
var User = require('../models/user');
var Comment = require('../models/comment');

var convert = require('../utils/convert');
var arrays = require('../utils/arrays');
var params = require('../utils/params');
var general = require('../utils/general');

var requireAuhentication = require('../utils/authentication');

router.all("*", requireAuhentication);

// post post with post :P
// POST
router.post('/post', function(req, res, next) {

    // user submitted values
    var bubbleId = req.body.bubble_id;
    var content = parseContent(req.body.content, 1);
    var title = req.body.title;
    var description = req.body.description;

    // inferred values
    var typeId = 1;
    var createdAt = convert.dateToSqlFormat(new Date());

    Bubble.where({id: bubbleId}).fetch().then(function (bubble){
        if (!bubble){
            general.sendMessage(res, "This bubble doesn't exist or it was deleted!", 404);
        } else {

            if (!req.isAuthenticated() || bubble.attributes.user_id != req.user.id){
                return general.sendMessage(res, "You don't have permission to post in this bubble!", 403)
            }

            Content.forge({
                bubble_id: bubbleId,
                content: content,
                title: title,
                description: description,
                content_type_id: typeId,
                created_at: createdAt,
            }).save().then(function(saved){
                res.status(200);
                return res.json(saved);
            })
        }
    })
});

// Gets latest posts in the specified bubble
// parameters:  bubble_id - id of the target bubble
//              from - number of latest posts to skip
//              size - total number of posts to return
// GET
router.get('/post', function(req, res, next) {

    var bubbleId = req.query.bubble_id;
    var typeId = 1;
    var context = {
        size: req.query.size,
        from: req.query.from,
        res: res
    }

    if (!params.checkInitSizeAndFrom(context, 5, 0)){
        return
    }

    Bubble.where({id: bubbleId}).fetch().then(function (bubble){
        if (!bubble){
            general.sendMessage(res, "This bubble doesn't exist or it was deleted!", 404);
        } else {

            var results = {
                posts: []
            }

            Content
                .where({bubble_id: bubbleId, content_type_id:typeId})
                .query(function(qb){
                    qb.orderBy('created_at','DESC');
                })
                .fetchAll()
                .then(function(collection){
                    arrays.rangeCopy(collection.models, results.posts, context.from, context.size);
                    res.status(200);
                    return res.send(results);
                })
        }
    })
});

router.post('/edit/:id', function(req, res, next){

    var contentId = req.params.id;
    var newTitle = req.body.title;
    var newDescription = req.body.description;

    Content.where({id: contentId}).fetch().then(function(content){
        if(!content){
            general.sendMessage(res, "This post doesn't exist or it was deleted!", 404);
        } else {
            Bubble.where({id: content.attributes.bubble_id}).fetch().then(function(bubble){
                if (!req.isAuthenticated() || bubble.attributes.user_id != req.user.id){
                    return general.sendMessage(res, "You don't have permission to edit this content!", 403)
                } else {
                    var newContent = parseContent(req.body.content, content.attributes.content_type_id);
                    Content.forge({
                        id: contentId,
                        title: newTitle,
                        description: newDescription,
                        content: newContent
                    }).save().then(function(saved){
                        res.status(200);
                        return res.json(saved);
                    });
                }
            })
        }
    })
})

router.post('/delete/:id', function(req, res, next){
    var contentId = req.params.id;

    Content.where({id: contentId}).fetch().then(function(content){
        if(!content){
            general.sendMessage(res, "This post doesn't exist or it was deleted!", 404);
        } else {
            Bubble.where({id: content.attributes.bubble_id}).fetch().then(function(bubble){
                if (!req.isAuthenticated() || bubble.attributes.user_id != req.user.id){
                    return general.sendMessage(res, "You don't have permission to delete this content!", 403)
                } else {
                    Content.where({id: contentId}).destroy().then(function(destroyed){
                        res.status(200);
                        return res.json(destroyed);
                    })
                }
            })
        }
    })

})

router.get('/timeline', function(req, res) {
    var user = req.user;
    Content.query(function (qb) {
        qb.join('bubble', 'content.bubble_id', '=', 'bubble.id').where('bubble.user_id', user.id).andWhere(function () {
            this.where('bubble_type_id', 1).orWhere('bubble_type_id', 3);
        }).orderBy('created_at', 'DESC');
    }).fetchAll().then(function (posts) {
        res.json( {posts: posts} );
    });
});

router.get('/myBubbles', function (req, res) {
    req.user.getCreatedBubbles().then(function (bubbles) {
        res.json({bubbles: bubbles});
    });
});

router.get('/comments/:content_id', function (req, res) {
    Content.where({id: req.params.content_id}).fetch({withRelated: 'comments.user'}).then(function (content) {
        var comments = content.related('comments').map(function (fetchedComment) {
            var comment = fetchedComment.toJSON();
            delete comment['user'];
            var author = fetchedComment.related('user');
            comment['username'] = author.get('username');
            comment['first_name'] = author.get('first_name') || '';
            comment['middle_name'] = author.get('middle_name') || '';
            comment['last_name'] = author.get('last_name') || '';
            return comment;
        });
        res.json({comments: comments});
    })
});

router.post('/comment/:content_id', function(req, res, next) {
    Comment.forge({
        user_id: req.user.id,
        content_id: req.params.content_id,
        comment: req.body.comment
    }).save();
})

function parseContent(content, type){
    if (type == 1){
        return content;
    }
}

module.exports = router;
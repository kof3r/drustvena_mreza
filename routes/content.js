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
var convert = require('../utils/convert');
var arrays = require('../utils/arrays');
var params = require('../utils/params');
var general = require('../utils/general');

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
    var updatedAt = null;

    Bubble.where({id: bubbleId}).fetch().then(function (bubble){
        if (!bubble){
            general.sendMessage("This bubble doesn't exist or it was deleted!", 404);
        } else {


            Content.forge({
                bubble_id: bubbleId,
                content: content,
                title: title,
                description: description,
                content_type_id: typeId,
                created_at: createdAt,
                updated_at: updatedAt
            }).save().then(function(saved){
                res.json(saved);
                return res.status(200);
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

    var bubbleId = req.body.bubble_id;
    var typeId = 1;
    var context = {
        size: req.body.size,
        from: req.body.from,
        res: res
    }

    if (!params.checkInitSizeAndFrom(context, 5, 0)){
        return
    }

    Bubble.where({id: bubbleId}).fetch().then(function (bubble){
        if (!bubble){
            general.sendMessage("This bubble doesn't exist or it was deleted!", 404);
        } else {
            var results = {
                posts: []
            }

            if (bubble.user_id != req.user.id){
                return general.sendMessage("You don't have permission to post in this bubble!", 403)
            }

            Content
                .where({bubble_id: bubbleId, content_type_id:typeId})
                .orderBy('created_at', 'DESC')
                .fetchAll()
                .then(function(collection){
                    arrays.rangeCopy(collection.models, results.posts, context.from, context.size);
                    return res.send(results);
                })
        }
    })
});

router.post('/edit', function(req, res, next){

    var contentId = req.body.id;
    var newTitle = req.body.title;
    var newDescription = req.body.description;
    var newContent = parseContent(req.body.content, req.body.content_type_id);

    Content.where({id: contentId}).fetch().then(function(content){
        if(!content){
            general.sendMessage("This post doesn't exist or it was deleted!", 404);
        } else {
            Bubble.where({id: content.bubble_id}).fetch().then(function(bubble){
                if (bubble.user_id != req.user.id){
                    return general.sendMessage("You don't have permission to edit this post!", 403)
                } else {
                    Content.forge({
                        id: contentId,
                        title: newTitle,
                        description: newDescription,
                        content: newContent,
                        updated_at: convert.dateToSqlFormat(new Date())
                    }).save().then(function(saved){
                        res.json(saved);
                        return res.status(200);
                    });
                }
            })
        }
    })
})

router.post('/delete')

function parseContent(content, type){
    if (type == 1){
        return content;
    }
}

module.exports = router;
/**
 * Created by Domagoj on 28.12.2015..
 */
var express = require('express');
var router = express.Router();
var ValidationError = require('../models/errors/validationError');
var User = require('../models/user');
var Message = require('../models/message');
var general = require('../utils/general');
var requireAuthentication = require('../utils/authentication');
var convert = require('../utils/convert');
var Promise = require('bluebird');
router.all("*", requireAuthentication);

// asynchronous messages

// gets all messages received by this user that are not marked as read
router.get('/unread', function(req, res, next){

    Message
        .query({
            where: {recipient: req.user.attributes.username, read:null},
        })
        .fetchAll()
        .then(function(results){
            return general.sendJsonResponse(res, {
                length: results.models.length,
                messages: results.toJSON()
            }, 200, null)
        })
})

// gets all messages of this user
router.get("/my",function(req,res,next){

    Message
        .query({
            where: {sender: req.user.attributes.username},
            orWhere: {recipient: req.user.attributes.username}
        })
        .fetchAll()
        .then(function(results){
            return general.sendJsonResponse(res, {
                length: results.models.length,
                messages: results.toJSON()
            }, 200, null)
        })
});

// gets all messages between the currently logged in user and the user with specified id
router.get("/my/:user_name",function(req,res,next){

    User.where({username: req.params.user_name}).fetch().then(function(user){
        if (!user){
            return general.sendMessage(res, "The specified user doesn't exist", 404);
        }

        console.log(user.attributes.username + ' ' + req.user.attributes.username);

        Promise.join(
            getMySent(req.user.attributes.username, user.attributes.username),
            getOtherSent(req.user.attributes.username, user.attributes.username),

            function(_mySent, _otherSent){

                var sent = _mySent.toJSON();
                var received = _otherSent.toJSON();

                var messages = sent.concat(received);
                return general.sendJsonResponse(res, {
                    length: messages.length,
                    messages: messages
                }, 200, null)
        })

    })
});

// sends message to another user
router.post('/:user_name', function(req, res, next){

    User.where({username: req.params.user_name}).fetch().then(function(user){
        if (!user){
            return general.sendJsonResponse(res, null, 404, "The specified user doesn't exist");
        }

        Message
            .forge({
                sender: req.user.attributes.username,
                recipient: user.attributes.username,
                message: req.body.message
            })
            .save()
            .then(function(results){
                return general.sendJsonResponse(res, results.toJSON(), 200, null)
            })
    })
})

// marks message as read
router.post('/mark/:message_id', function(req, res, next){

    Message.where({id: req.params.message_id}).fetch().then(function(message){
        if (!message){
            return general.sendJsonResponse(res, null, 404, "The specified message doesn't exist");
        }

        if (message.attributes.recipient != req.user.attributes.username){
            return general.sendJsonResponse(res, null, 403, "The specified message isn't yours!");
        }

        Message
            .forge({
                id: req.params.message_id,
                read: convert.dateToSqlFormat(new Date())
            })
            .save()
            .then(function(results){
                return general.sendJsonResponse(res, results.toJSON(), 200, null)
            })
    })
})

function getMySent(myUserName, otherUserName){
    return Message.query({
        where: {sender: myUserName},
        andWhere: {recipient:otherUserName}
    }).fetchAll()
}

function getOtherSent(myUserName, otherUserName){
    return Message.query({
        where: {sender: otherUserName},
        andWhere: {recipient:myUserName}
    }).fetchAll()
}


module.exports=router;
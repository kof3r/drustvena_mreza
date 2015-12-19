/**
 * Created by Gordan on 19.12.2015..
 */

var express = require('express');
var router = express.Router();

var Comment = require('../models/comment');

var requireAuthentication = require('../utils/authentication');

var ValidationError = require('../models/errors/validationError');

router.all('*', requireAuthentication);

router.post('/edit/:id', function(req, res) {
    var form = req.body;
    var user = req.user;

    Comment.where({
        id: req.params.id
    }).fetch().then(function (comment) {
        if(comment.get('user_id') === user.get('id')) {
            comment.set('comment', form.comment);
            return comment.save();
        }
        res.status(403).json({error: 'You don\'t have permission to edit this comment.'})
    }).then(function (comment) {
        comment.set('first_name', user.get('first_name'));
        comment.set('last_name', user.get('last_name'));
        comment.set('middle_name', user.get('middle_name'));
        comment.set('username', user.get('username'));
        res.json(comment);
    })
});

module.exports = router;
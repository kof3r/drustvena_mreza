/**
 * Created by Gordan on 14.12.2015..
 */

var ValidationError = require('../models/errors/validationError');

var express = require('express');
var router = express.Router();

var Bubble = require('../models/bubble');
var Content = require('../models/content');

var requireAuhentication = require('../utils/authentication');

router.all("*", requireAuhentication);

router.post('/create', function(req, res) {
    var form = req.body;
    Bubble.forge({
        user_id: req.user.get('id'),
        bubble_type_id: 3,
        title: form.title,
        description: form.description
    }).save().then(function (bubble) {
        res.end();
    }).catch(ValidationError, function (error) {
        res.json({errors: error.messages});
    })
});

router.get('/:id', function (req, res) {
    Content.where({bubble_id: req.params.id}).fetchAll().then(function (contents) {
        res.json({contents: contents});
    })
});

module.exports = router;
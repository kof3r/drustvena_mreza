/**
 * Created by Gordan on 14.12.2015..
 */

var express = require('express');
var router = express.Router();

var Bubble = require('../models/bubble');

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
    }).catch(function (error) {
        console.log(error);
    })
})

module.exports = router;
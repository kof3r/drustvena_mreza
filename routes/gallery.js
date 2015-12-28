/**
 * Created by Gordan on 28.12.2015..
 */

var express = require('express');
var router = express.Router();

var Bubble = require('../models/bubble');

var requireAuthentication = require('../utils/authentication');

router.all('*', requireAuthentication);

router.get('/id/:user_id', function (req, res) {
    var user_id = req.params.user_id;

    Bubble.where({user_id: user_id, bubble_type_id: 2}).fetch({columns: 'id'}).then(function (gallery_id) {
        res.json(gallery_id);
    })
});

module.exports = router;
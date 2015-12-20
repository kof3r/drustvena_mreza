/**
 * Created by Gordan on 20.12.2015..
 */

var express = require('express');
var router = express.Router();
var ValidationError = require('../models/errors/validationError');

router.all('*', require('../utils/authentication'));

router.post('/changePassword', function(req, res) {
    var user = req.user;
    var form = req.body;

    user.set('password_hash', form.password);
    user.save().then(function (user) {
        user.unset('password_hash');
        res.json(user);
    }).catch(ValidationError, function(error) {
        res.status(400).json({errors: error.messages});
    })
});

module.exports = router;
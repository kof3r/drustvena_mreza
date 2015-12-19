/**
 * Created by Gordan on 19.12.2015..
 */

var express = require('express');
var router = express.Router();

var Country = require('../models/country');

router.get('/countries', function (req, res) {
    Country.query(function (qb) {
        qb.orderBy('name');
    }).fetchAll().then(function (countries) {
        res.json({countries: countries});
    })
})

module.exports = router;
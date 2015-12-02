/**
 * Created by Mislav on 11/27/2015.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.end("Main api route.")
});

module.exports=router;
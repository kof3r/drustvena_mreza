/**
 * Created by Domagoj on 23.12.2015..
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/img/:img_file', function(req, res, next) {
    var file = req.params.img_file;
    if (req.query.size && req.query.size != 'original'){
        file = req.query.size.toString() + file.toString();
    }

    console.log(file);
    fs.readFile('./res/img/' + file, function (err, data) {
        if (err) console.log(err);
        res.end(data);
    });
});

module.exports=router;
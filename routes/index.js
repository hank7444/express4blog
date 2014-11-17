var express = require('express');

var router = express.Router();
//var mongoose = require('mongoose');
var config = require('../config').db;
var uploadMiddleware = require('./middlewares/upload');

//mongoose.connect(config);

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'index',
        css: [
            '/stylesheets/test.css'
        ],
        js: [
            '/javascripts/lib/jquery_plugin/jquery.watermark.min.js',
            '/javascripts/index.js'
        ]
    });
    res.end();
});

router.get('/about', function(req, res) {
    res.render('about', {
        title: 'about'
    });
    res.end();
});

router.route('/img')
    .get(function(req, res, next) {

    })
    .post(uploadMiddleware.tmpImg, function(req, res, next) {

        var output = {
            paths: req.files.file.paths,
            status: true
        };
        res.json(output);
        res.end();
    });

module.exports = router;
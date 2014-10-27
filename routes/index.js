var express = require('express');
var router = express.Router();

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

module.exports = router;

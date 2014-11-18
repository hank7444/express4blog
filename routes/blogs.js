var express = require('express');
var async = require('async');
var router = express.Router();
var modelBlog = require('../models/blogs');

router.get('/', function(req, res) {
	res.redirect('/blogs/1');
    res.end();
});

// /blog/
router.get('/:pager', function(req, res) {

	async.waterfall([

        // 取得使用者資料
        function(callback) {
            modelBlog.getBlogs(req.params.pager, 5, callback);
        },

    ], function (err, status, blogs, pager) { // done就會跑來這

        res.render('blogs/index', {
	        title: 'all blogs',
	        blogs: blogs,
	        pager: pager,
	        css: [
	            '/stylesheets/blogs.css'
	        ],
	        js: [
	        	'/javascripts/blogs/list.js'
	        ]
	    });
	    res.end();
    });
});


router.route('/show/:blogId')
	
	.get(function(req, res) {

		res.send('hello ' + req.params.blogId);
		res.end();
	})
	.post(function(req, res) {

	});


module.exports = router;
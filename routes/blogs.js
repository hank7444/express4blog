var express = require('express');
var async = require('async');
var router = express.Router();
var modelBlog = require('../models/blogs');
var loginMiddleware = require('./middlewares/login');

router.get('/', function(req, res) {
	res.redirect('/blogs/1');
    res.end();
});

// /blog/
router.get('/:pager', function(req, res) {

	async.waterfall([

        // 取得使用者資料
        function(callback) {
            modelBlog.findAll(req.params.pager, 5, callback);
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


router.post('/comment', [loginMiddleware('請先登入才可以評論喔aaa！')], function(req, res) {

	// 抓不存在的屬性就戠接壞掉..
	var uid = req.session.user._id;   	
	modelBlog.addCommentById(uid, req, res);
});


router.route('/show/:blogId')
	
	.get(function(req, res) {

		async.waterfall([

	        // 取得使用者資料
	        function(callback) {
	            modelBlog.find(req.params.blogId, callback);
	        },

	    ], function (err, status, blog) { // done就會跑來這

	    	blog.comments.reverse();

	        res.render('blogs/view', {
		        title: 'blog',
		        user: req.session.user,
		        blog: blog,
		        css: [
		            '/stylesheets/blogs.css'
		        ],
		        js: [
		        	'/javascripts/lib/jquery_plugin/jquery.validate.1.11.1.min.js',
		        	'/javascripts/blogs/view.js'
		        ]
		    });
		    res.end();
	    });
	})
	.post(function(req, res) {

	});


module.exports = router;
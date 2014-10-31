var express = require('express');
var async = require('async');
var router = express.Router();
var modelUser = require('../models/users');



// /user/
router.get('/', function(req, res) {
    res.redirect('/users/signin');
    res.end();
});


// 另一種寫法, 可以直接把get, post..等都串在一起
router.route('/register')
    .get(function(req, res) {
        res.render('users/register', {
            title: 'register',
            js: [
                '/javascripts/lib/jquery_plugin/jquery.validate.1.11.1.min.js',
                '/javascripts/register.js'
            ]
        });
        res.end();
    })
    .post(function(req, res) {
        modelUser.register(req, res);
    });

router.route('/signin')

	// 無論是get, post, put, delete, 都會到這裡
	.all(function(req, res, next) { 
		console.log('/login all!');
		next(); // 這個很重要，沒有寫就不會繼續往下走了
	})
    .get(function(req, res) {


        // 很奇怪req.flash回來的要先轉成字串才能用?
        var status = req.flash('status').toString() || '{}';

        try {
            status = JSON.parse(status);
        }
        catch (e) {
            console.log('/signin JSON parse error!');
        }

        res.render('users/signin', {
            title: 'signin',
            js: [
                '/javascripts/lib/jquery_plugin/jquery.validate.1.11.1.min.js',
                '/javascripts/signin.js'
            ],
            error: status.msg
        });
    })
    .post(function(req, res) {
        modelUser.signin(req, res);
    });

router.route('/signout')
    .get(function(req, res) {
        req.session.signed = false;
        req.session.user = null;
        res.redirect('/');
        res.end();
    });

/*
RESTful的觀念, 同個route用不同的method可以做不同的事,
例如: 
GET /users/1 取得id=1的user
POST /users  新增一位user
PUT /users/1 修改id=1的user
DELETE /users/1 刪除id=1的user
*/
router.route('/editme')
	.get(function(req, res, next) {

		async.waterfall([

            // 取得使用者資料
            function(callback) {

                var uid = req.session.user._id;
                modelUser.getUserById(uid, res, next, callback);
            },
            function(user, callback) {

                callback(null, user);
            }
        ], function (err, user) { // done就會跑來這

            res.render('users/editme', {
                title: 'editme',
                user: user,
                js: [
                    '/javascripts/lib/jquery_plugin/jquery.ui/jquery.ui.min.js',
                    '/javascripts/lib/jquery_plugin/jquery.validate.1.11.1.min.js',
                    '/javascripts/lib/jquery_plugin/fileupload/jquery.fileupload.js',
                    '/javascripts/util.js',
                    '/javascripts/editme.js'
                ],
                css: [
                    '/javascripts/lib/jquery_plugin/jquery.ui/jquery.ui.min.css'
                ]
            });
            res.end();
        });
	})
	.put(function(req, res) {
        var uid = req.session.user._id;
        modelUser.updateUserById(uid, req, res);
	});

module.exports = router;
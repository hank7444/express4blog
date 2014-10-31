var md5 = require('MD5');
var mongoose = require('./proxy');
var async = require('async');
var moment = require('../proxy_modules/moment');


// 建立user schema
var userSchema = mongoose.Schema({
    account: String,
    nickname: String,
    password: String,
    createTime: {
        type: Date,
        default: Date.now // 設定初始值
    },
    updateTime: {
        type: Date,
        default: Date.now // 設定初始值
    },
    lastLoginTime: {
        type: Date,
        default: ''
    }
});


// 建立資料model
// model('Users'), 如果db沒有users table, 就會產生一個, 大小寫到db都會一律小寫
var Users = mongoose.model('users', userSchema);


/*
應該只讓model處理資料, 一切的狀態與error都回傳給router比較好?
還是model自己做掉錯誤與狀態判斷，只給router乾淨的資料比較好?
*/
var exports = {
    register: function(req, res) {

        // backend要驗證frontend的來源，這邊就先不做了

        // 判斷該帳號是否已經有註冊了?
        // 利用module async控制flow, 避免過度的巢狀韆套
        async.parallel({
                count: function(callback) {
                    setTimeout(function() {
                        callback(null, 'one');
                    }, 200);
                    Users.count({
                        account: req.body.account
                    }, function(err, count) {
                        callback(null, count);
                    });
                }
            },
            function(err, results) {

                if (results.count > 0) {
                    status = {
                        status: 'failed',
                        msg: '該email已經被註冊過了噢！'
                    };
                    res.status(200).json(status);
                    res.end();
                    return false;
                }
                var users = new Users();
                var status = {};
                users.account = req.body.account;
                users.nickname = req.body.nickname;
                users.password = md5(req.body.password); // md5加密
                users.save(function(err) {

                    if (err) {
                        status = {
                            status: 'failed',
                            msg: '儲存發生錯誤，請再試一次'
                        };
                        res.status(200).json(status);
                        res.end();
                        return false;
                    }
                    status = {
                        status: 'ok',
                        msg: '儲存成功'
                    };
                    res.status(200).json(status);
                    res.end();
                });
            });
    },
    signin: function(req, res) {

        var account = req.body.account;
        var password = md5(req.body.password);
        var isShortLogin = req.body.isShortLogin || 3600000;
        var status = {};

        async.waterfall([

            // 取得使用者資料
            function(callback) {

                Users.findOne()
                    .where('account').equals(account)
                    .where('password').equals(password)
                    .select('_id nickname lastLoginTime')
                    .exec(function(err, user) {

                        if (err) {
                            status = {
                                status: 'failed',
                                msg: '登入發生錯誤!'
                            };
                        }
                        else if (!user) {
                            status = {
                                status: 'failed',
                                msg: '帳號不存在或密碼錯誤!'
                            };
                        }
                        callback(null, account, status, user);
                    });
            },

            // 更新最後登入日期，如果有任何錯誤，就redirect回signin頁面並拋出錯誤訊息
            function(account, status, user, callback) {

                // 更新最後登入時間
                Users.update({}, {
                    lastLoginTime: new Date()
                })
                    .where('account').equals(account)
                    .limit(1)
                    .exec(function(err) {

                        if (err) {
                            status = {
                                status: 'failed',
                                msg: '登入發生錯誤!'
                            };
                        }
                        if (status.status === 'failed') {
                            req.flash('status', JSON.stringify(status));
                            res.redirect('/users/signin');
                            res.end();
                            return false;
                        }
                        callback(null, user);
                    });
            },

            // 成功登入，將使用者資訊寫進session
            function(user, callback) {

                status = {
                    status: 'ok',
                    msg: ''
                };

                // 將使用者資訊寫進session
                req.session.signed = true;
                req.session.user = {
                    _id: user._id,
                    nickname: user.nickname,
                    lastLoginTime: moment(user.lastLoginTIme).fromNow() || '無'
                };

                // 設定cookie時效
                if (isShortLogin) {
                    res.cookie('signin', {
                        nickname: user.nickname
                    }, {
                        maxAge: isShortLogin
                    });
                }

                res.redirect('/');
                res.end();
                callback(null, 'done');
            }
        ], function(err, result) { // done就會跑來這

        });
    },

    // 其實登入後這些資料都可以寫到seesion, 這邊只是為了多做練習而多此一舉
    getUserById: function(uid, res, next, callback) {

        Users.findOne({
            _id: uid
        })
            .select('account nickname')
            .exec(function(err, user) {

                if (err) {
                    res.status(500);
                    next(new Error('讀取資料庫發生錯誤!'));
                }

                if (!user) {
                    res.status(404);
                    next(new Error('此會員不存在!'));
                }
                callback(null, user);
            });
    },
    updateUserById: function(uid, req, res) {

    	var updateData = {
    		nickname: req.body.nickname,
    		updateTime: new Date()
    	};

    	if (req.body.newpassword) {
    		updateData.password = md5(req.body.newpassword);
    	}

        Users.update({
        	_id: uid    
 		}, updateData)
            .limit(1)
            .exec(function(err) {

            	console.log(err);

                if (err) {
                    status = {
                        status: 'failed',
                        msg: '儲存發生錯誤，請再試一次'
                    };
                    res.status(200).json(status);
                    res.end();
                    return false;
                }
                status = {
                	nickname: updateData.nickname,
                    status: 'ok',
                    msg: '儲存成功'
                };

                req.session.user.nickname = req.body.nickname;
                res.status(200).json(status);
                res.end();
            });
    }
};
module.exports = exports;

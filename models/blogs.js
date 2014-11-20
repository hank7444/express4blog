var md5 = require('MD5');
var mongoose = require('./proxy');
var async = require('async');
var moment = require('../proxy/moment');
var imgTool = require('../tool/img');
var pagerTool = require('../tool/pager');


var commentSchema = mongoose.Schema({
    title: String,
    body: String,
    author: {
        type: String,
        ref: 'users'
    },
    createTime: {
        type: Date,
        default: Date.now
    }
});

var blogSchema = mongoose.Schema({
    title: String,
    body: String,
    author: {
        type: String,
        ref: 'users'
    },
    comments: [commentSchema],
    createTime: {
        type: Date,
        default: Date.now // 設定初始值
    },
    updateTime: {
        type: Date,
        default: Date.now // 設定初始值
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

var Blogs = mongoose.model('blogs', blogSchema);


var exports = {
    findAll: function(pager, limit, callback) {

        async.parallel({

            // 計算blog總共有多少篇
            count: function(callbackParallel) {
                Blogs.count({
                }, function(err, count) {
                    callbackParallel(null, count);
                });
            }
        },
        function(err, results) {

            // 計算分頁資料
            var pagerData = pagerTool.calculatePager(pager, results.count, limit);

            Blogs.find({isDelete: false})
            .populate('author', 'img nickname') // 跟sql的join功能一樣
            .skip(pagerData.from)
            .limit(limit)
            .sort({
                updateTime: 'desc'
            })
            .exec(function(err, blogs) {

                var status = null;

                if (err) {
                    status = {
                        status: 'failed',
                        msg: '發生錯誤!'
                    };
                }
                blogs.forEach(function(obj, index) {

                    // moogoose的object不能新增schema以外的資料, 所以要透過使用toObject()
                    // 將mongoose object轉成plain object
                    obj = blogs[index] = blogs[index].toObject();
                    obj.updateTime = moment(obj.updateTime).fromNow();
                    obj.author.img = imgTool.imgPathAddTag(obj.author.img, 's');
                });
                callback(null, status, blogs, pagerData);
            });
        });
    },
    find: function(id, callback) {

        Blogs.findOne({
            '_id': id,
            'isDelete': false
        })
        .populate('author', 'img nickname')
        .populate('comments.author', 'img nickname') // 拿到所有評論的作者資料, 不知這樣做效能怎樣?
        .exec(function(err, blog) {

            var blog = blog.toObject();
            console.log(blog);
            blog.updateTime = moment(blog.updateTime).fromNow();
            blog.author.img = imgTool.imgPathAddTag(blog.author.img, 's');

            blog.comments.forEach(function(comment, index) {
                blog.comments[index].createTime =  moment(comment.updateTime).fromNow();
                blog.comments[index].author.img = imgTool.imgPathAddTag(comment.author.img, 's');
            });

            var status = null;

            if (err) {
                status = {
                    status: 'failed',
                    msg: '發生錯誤!'
                };
            }
            callback(null, status, blog);
        });

    },
    addCommentById: function(uid, req, res) {

        var blogId = req.body.blogId;
        var updateTime = new Date();
        var updateData = {
            title: req.body.title,
            body: req.body.comment,
            author: uid
        };



        Blogs.findOneAndUpdate({
                _id: blogId    
            }, {
                updateTime: updateTime,
                $push: {
                    'comments': updateData
                }
            })
            .exec(function(err) {

                if (err) {
                    status = {
                        status: 'failed',
                        msg: '儲存發生錯誤，請再試一次'
                    };
                    res.status(200).json(status);
                    res.end();
                    return false;
                }

                var userData = req.session.user;


                var output = {
                    title: req.body.title,
                    body: req.body.comment,
                    createTime: moment(updateTime).fromNow(),
                    author: {
                        nickname: userData.nickname,
                        img: imgTool.imgPathAddTag(userData.img, 's')
                    }
                };


                status = {
                    status: 'ok',
                    msg: '儲存成功',
                    show: output
                };
                res.status(200).json(status);
                res.end();
            });
    }
};
module.exports = exports;
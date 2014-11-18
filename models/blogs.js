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
    getBlogs: function(pager, limit, callback) {

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
                            msg: '登入發生錯誤!'
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
    }
};
module.exports = exports;
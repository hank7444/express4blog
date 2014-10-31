var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var flash = require('connect-flash');
var _ = require('underscore');

var routes = require('./routes/index');
var users = require('./routes/users');
var engine = require('ejs-mate');

var app = express();

// view engine setup
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.use(cookieParser());
app.use(flash()); // 設定讓redirect可以互傳資料用

// 設定session儲存在redis裡面s
app.use(session({
    secret: 'blogs',
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379,
        db: 2,
        pass: 'RedisPASS'
    })
}));

// 設定靜態檔案目錄
app.use(express.static(path.join(__dirname, 'public')));

// 將session放出來讓所有view都可以用
// 如果有其他global變數也可以用res.locals來噻
app.use(function(req, res, next) {

    // 如果cookies已經過期(就是已經不見了), 將登入的session清除
    if (!req.cookies.signin) {
        req.session.signed = false;
        req.session.user = null;
    }
    res.locals.session = req.session;

    var pages = {
        nonsigined: ['/', '/users/signin', '/users/register', '/about'], // 不需登入頁面
        sigined: ['/users/signin', '/users/register'] // 如果登入需導向首頁的頁面
    };


    if (req.method === 'GET') {

        // 如果沒登入, 進入到需要登入的頁面就自動重新導向回signin
        if (!req.session.signed && !_.contains(pages.nonsigined, req.url)) {
            res.redirect('/users/signin');
            res.end();
            return false;
        }
        // 如果已經登入，到某些特定頁面將直接導回首頁
        else if (req.session.signed && _.contains(pages.sigined, req.url)) {
            res.redirect('/');
            res.end();
            return false;
        }
    }
    next();
});


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
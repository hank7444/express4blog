var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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
app.use(function(req, res, next){
  
  // 如果session沒有signed變數，塞一個進去
  if (!req.session.signed) {
    req.session.signed = false;
  }

  res.locals.session = req.session;
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

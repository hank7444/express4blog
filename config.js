/*
	改變NODE ENV
	在command輸入export NODE_ENV=production or 其他的
	在express的app.get('env')就會拿到該值, 可以用來設定server是開發, 測試還是正式環境
*/
var express = require('express');
var app = express();
var env = app.get('env') || 'development';
var configs = {
	development: {
		db: 'mongodb://localhost/blog'
	},
	production: {
		db: 'mongodb://localhost/blog'
	}
};
var config = !!configs[env] ? configs[env] : configs['development'];

module.exports = config;
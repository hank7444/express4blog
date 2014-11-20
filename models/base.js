// 因為同樣的mongodb位置, connect兩次會發生錯誤: "Trying to open unclosed connection."
// 所以所有的model用的mongoose都從這個proxy拿, 避免重複connect的問題

var mongoose = require('mongoose');
var config = require('../config').db;
mongoose.connect(config);

module.exports = mongoose;
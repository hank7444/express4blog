var fs = require('fs');
var moment = require('moment');
var multer  = require('multer'); // 上傳檔案或圖片需要
var easyimg = require('easyimage');
var sizeOf = require('image-size');
var path = require('path');
var _ = require('underscore');
var async = require('async');
var tmpImgMulter = multer({dest: './public/uploads/tmpimg'});



var removeTmpFile = function(folderName) {

	//folderName = folderName || 'tmpImg';

	console.log('AAAAAA');
	//console.log(removeTmpFile[folderName]);

	// 這樣寫法會把產生的funciton存在removeTmpFile[folderName]裏面(全域變數);
	return removeTmpFile[folderName] || (removeTmpFile[folderName] = function(req, res, next) {

		console.log('##########');
		console.log(folderName);

		var dir = './public/uploads/' + folderName;
	    var files = fs.readdirSync(dir);
	    var now = moment();

	    files.forEach(function(value, key) {

	        if (!/^\./.test(value)) {

	            var fullPath = dir + '/' + value;
	            var stat = fs.statSync(fullPath);
	            var atime = moment(stat.atime);
	            var diff = now.diff(atime, 'seconds');
	            
	            // 如果2小時都沒使用, 將檔案清除
	            if (diff > 60) {
	                fs.unlinkSync(fullPath);
	            }
	        }
	    });
	    next();
	});
};



var resize = function(req, res, next) {
	
	var fileName = req.files.file.name;
	var fileExt = path.extname(fileName);
	var fileNameWithoutExt = fileName.replace(fileExt, '');
	var filePath = req.files.file.path;
	var fileDir = path.dirname(filePath);
	var imgSize = JSON.parse(req.body.imgSize);

	req.files.file.paths = {};

	req.files.file.paths['orig'] = {
		'name': 'orig',
		'path': req.files.file.path
	};


	// async控制流程真好用~顆顆
	async.waterfall([

	    function(callback) {

	    	// 將圖片的exf訊息清除
			easyimg.exec('convert ' + filePath + ' -strip ' + filePath).then(function (file) {
				callback(null, 'done');
		    });
	    }, 

	], function(err, result) { // done就會跑來這

		// 全部each做完才callback, 不過async的each竟然只能用array @@!
		async.each(imgSize, function(item, callback) {
				
			var key = item.name;
			var newSize = item.size.split('x');
			var newFilePath = fileDir + '/' + fileNameWithoutExt + '_' + key + fileExt;


			easyimg.resize({
				src: filePath, 
				dst: newFilePath,
	     		width: newSize[0], 
	     		height: newSize[1],
			}).then(
				function(image) {
				    console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
				    req.files.file.paths[key] = {
				    	'name': key,
				    	'path': newFilePath
				    };
				    callback(); // 如果沒有錯誤, callback不塞值, 就會往下個item走
				},
			  	function (err) {
			    	console.log(err);
			    	callback(err);
			  	}
			);
		}, function(err) {

		    // if any of the file processing produced an error, err would equal that error
		    if ( err ) {

		      // One of the iterations produced an error.
		      // All processing will now stop.
		      console.log('A file failed to process');
		    } else {
		      console.log('All files have been processed successfully');
		      next(); // 往下個middleware走
		    }
		});
    });
};
var regularPath = function(req, res, next) {

	console.log(req.files.file.paths);

	_.map(req.files.file.paths, function(value, key) {
		value.size = sizeOf(value.path);
		value.pathShow = value.path.replace('public', '');
		return value;
	});
	next();
};


var upload = {
	'tmpImg': [removeTmpFile('tmpImg'), tmpImgMulter, resize, regularPath]
};


module.exports = upload;
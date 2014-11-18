var async = require('async');
var path = require('path');
var fse = require('fs-extra');
var easyimg = require('easyimage');


var img = {
    copyFromTmp: function(option, callback) {

    	var imgSize = option.imgSize;
    	var oldFilePath = option.oldFilePath;
    	var newFileName = option.newFileName;
    	var newFolderPath = option.newFolderPath;
    	var isClearNewFolder = option.isClearNewFolder;

        var imgExt = path.extname(oldFilePath);
        var newfilePathOrigin = newFolderPath + newFileName + imgExt;


        // 刪除整個資料夾
        if (isClearNewFolder) {
        	fse.removeSync(newFolderPath);
    	}

        // 複製並產生使用者profile圖片
        fse.copy(oldFilePath, newfilePathOrigin, function(err) {

            if (err && callback && typeof callback == 'function') {
                return callback(null);
            }
            console.log('success');


            // 將圖resize
            // 全部each做完才callback, 不過async的each竟然只能用array @@!
            async.each(imgSize, function(item, callbackEach) {

                var key = item.name;
                var newSize = item.size.split('x');
                var newFilePath = newfilePathOrigin.substr(0, newfilePathOrigin.lastIndexOf('.')) + '_' + item.name + imgExt;

                easyimg.resize({
                    src: newfilePathOrigin,
                    dst: newFilePath,
                    width: newSize[0],
                    height: newSize[1],
                }).then(
                    function(image) {
                        console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
                        callbackEach(); // 如果沒有錯誤, callback不塞值, 就會往下個item走
                    },
                    function(err) {
                        console.log(err);
                        callbackEach(err);
                    }
                );
            }, function(err) {

                // if any of the file processing produced an error, err would equal that error
                if (err) {

                    // One of the iterations produced an error.
                    // All processing will now stop.
                    console.log('A file failed to process');
                }
                else {
                    console.log('All files have been processed successfully');

                    if (callback && typeof callback == 'function') {
                    	callback(newfilePathOrigin);
                    }
                }
            });
        });
    },
    imgPathAddTag: function(imgPath, tagName) {

        if (!imgPath) {
            return '';
        }

        var lastIndex = imgPath.lastIndexOf('.');
        var substr = imgPath.substr(0, lastIndex);
        var begin = imgPath.length - lastIndex;
        var ext = imgPath.substr(-begin, begin);

        return substr + '_' + tagName + ext;
    }
};
module.exports = img;

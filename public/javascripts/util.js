/*
 * 相依套件: jQuery, jQueryUI, jqueryUpload
 */
var util = {

    /*
     * 上傳單張圖片
     * @param (string) divId 要綁定的img上傳區塊div id
     * @param (string) tmpFiles 檔案暫存用的名稱
     * @param (object) options 屬性設定 
     */
    uploadImgJquery: function(divId, options) {

        var options = options || {};
        var parent = util;
  
        options.file_size_limit = options.file_size_limit || '2000000';
        options.file_types = options.file_types || /(\.|\/)(jpe?g|png)$/i;
        options.imgSize = JSON.stringify(options.imgSize) || JSON.stringify([{
            name: 's',
            size: 300
        }, {
            name: 'l',
            size: 600
        }]);

        $div = $(divId);
        $progressbar = $div.find('.ProgressBar');
        $status = $div.find('.UploadStatus');
        $btnUpload = $div.find('a[name=btnUpload]');
        $input = $div.find('input[name="file"]');
        $photo = $div.find('.photo');

        // prograssBar
        $progressbar.progressbar({
            value: 0
        });

        // 上傳按鈕與input欄位綁定
        $btnUpload.on('click', function() {
            console.log('##########aaaa');
            $input.trigger('click');
        });
        
        $status.html('<span>準備上傳</span>');

        $input.fileupload({
            url: '/img',
            dataType: 'json',
            formData: {
                imgSize: options.imgSize
            },
            autoUpload: true,
            replaceFileInput: false,
            start: function(e, data) {

            },
            add: function(e, data) {

                //$input = $(this); // 如果replaceFileInput: true, 就要這行

                var isError = false;

                if (!options.file_types.test(data.originalFiles[0]['type'])) {

                    $.notify('圖片格式錯誤', "warn");
                    isError = true;
                }

                if (data.originalFiles[0]['size'] > options.file_size_limit) {
                    $.notify('圖片檔案大小不得超過' + options.file_size_limit / 1000 / 1000 + 'MB', "warn");
                    isError = true;
                }

                if (isError === false) {
                    data.submit();
                }
            },
            progress: function(e, data) {
                var persent = parseInt(data.loaded / data.total * 100, 10);

                $progressbar.progressbar({
                    value: persent
                });

                $status.html('檔案上傳進度：<span>' + persent + ' %</span>');

                if (persent == 100) {
                    $status.html('<span>伺服器處理檔案中，請稍候</span>');
                }

            },
            done: function(e, data) {

                $status.html('<span>' + data.originalFiles[0]['name'] + '</span> 檔案上傳成功');

                $progressbar.progressbar({
                    value: 100
                });

                var result = data.result;
                var img = result.paths['s'];

                switch (result.status) {
                    case true:
                        $photo.attr('width', img.size.width)
                              .attr('height', img.size.height)
                              .attr('src', img.pathShow);

                        $status.html('注意，要儲存成功後，檔案才會更新');
                        $progressbar.progressbar({
                            value: 0
                        });
                    break;

                    case false:
                        return false;
                        break;
                }
            },
            fail: function(e, error) {
                
            }
        });
    },
}
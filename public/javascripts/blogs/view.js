;
(function() {

    'use strict';

    $(function() {

        var $btnSubmit = $('#btnSubmit');
        var $form = $('#form');
        

        // 驗證錯誤訊息
        $.validator.messages = {
            required: '必填欄位',
            digits: '請輸入數字',
            url: '網址格式錯誤',
            email: 'email格式錯誤',
            maxlength: $.format('長度不可超過 {0} 個字'),
            minlength: $.format('長度不可小於 {0} 個字'),
        };
        $form.validate({
            errorElement: 'div',
            errorClass: 'help-block has-error',
            success: 'valid',
            rules: {
                'title': {
                    required: true,
                },
                'comment': {
                    required: true,
                }
            },
            messages: {

            },
            errorPlacement: function(error, element) {
                return $(error).appendTo($(element).parent());
            },
            highlight: function(e) {
                return $(e).closest('.form-group').removeClass('has-error has-success').addClass('has-error');
            },
            unhighlight: function(e) {
                return $(e).closest('.form-group').removeClass('has-error has-success');
            }
        });


        var addComment = (function() {

            var $commentsH2 = $('#comments > h2');
            var $commentTemplate = $('#commentTemplate');

            return function(commentData) {

                // 動態增加評論
                var $comment = $commentTemplate.clone();
                var img = commentData.author.img || '/images/default_member.png';

                $comment.find('.info').html(commentData.author.nickname + ', ' + commentData.createTime);
                $comment.find('.body').html(commentData.body);
                $comment.find('.title').find('span').html(commentData.title)
                                       .end().find('img').attr('src', img)
                                                         .attr('alt', commentData.author.nickname);
                $commentsH2.after($comment);
                $comment.fadeIn();
            };
        })();

        // 這邊用ajax的方式
        $btnSubmit.on('click', function(e) {
        	e.preventDefault();

        	if ($form.valid()) {

                var params = $form.serialize();


                var fadeInSettings = {
                    msg: '儲存中',
                    startCallback: function() {
                        //console.log('fadeIn Start');
                    },
                    endCallback: function() {
                        //console.log('fadeIn End');

                        $.post('/blogs/comment', params, null, 'json')
                         .done(function(data) {
                            
                            if (data.status == 'failed') {
                                $.notify(data.msg, "error");
                                return false;
                            }
                            else if (data.status == 'login') {
                                bootbox.alert(data.msg, function() {
                                    location.href = '/users/signin';
                                });
                                return false;
                            } 
                            $.notify("新增評論成功！", "success");

                            addComment(data.show);
                         })
                         .fail(function(err) {
                            $.notify(err.status + ' ' + err.statusText, "error");
                         })
                         .always(function() {
                            $.hiiirLoading('fadeOut');
                         });
                    }
                };

                // 全畫面loading效果
                $.hiiirLoading('fadeIn', fadeInSettings);
            }
            		
        });

    });

})(window, undefined);

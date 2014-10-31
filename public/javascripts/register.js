;
(function() {

    'use strict';

    $(function() {

        var $btnRegister = $('#btnRegister');
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
                'account': {
                    required: true,
                    maxlength: 30,
                    email: true
                },
                'nickname': {
                    required: true,
                    maxlength: 30
                },
                'password': {
                    required: true
                },
                'repassword': {
                    required: true,
                    equalTo: '#password'
                }
            },
            messages: {
                'repassword': {
                    equalTo: '密碼確認需跟密碼欄位一致'
                }

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

        // 這邊用ajax的方式
        $btnRegister.on('click', function(e) {
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

                        $.post('/users/register', params, null, 'json')
                         .done(function(data) {
                            
                            console.log(data);

                            if (data.status == 'failed') {
                                $.notify(data.msg, "error");
                                return false;
                            } 
                            $.notify("註冊成功！", "success");
                            alert('註冊成功！ 請點"確定"回到登入頁!');
                            location.href = '/users/login';
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

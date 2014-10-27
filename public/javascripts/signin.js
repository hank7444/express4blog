;
(function() {

    'use strict';

    $(function() {

        var $btnSignin = $('#btnSignin');
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
                    maxlength: 30
                },
                'password': {
                    required: true
                },
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

        $btnSignin.on('click', function(e) {
        	e.preventDefault();

        	if ($form.valid()) {
        		
        	}
        });

    });

})(window, undefined);

/*
hiiirLoading.js
=========================================================
Copyright 2013 Hiiir 台灣時間軸科技股份有限公司
建立者: Hank Kuo
建立時間: 2014-04-02

jquery版本支援: 1.4.1 up

套件描述: hiiirLoading可讓使用方便在目前html畫面上，
加上loading的lightbox與fade效果 
 */


/*
更新記錄:

日期: 2014-04-02
更新描述: 建立原件
更新人: Hank Kuo
*/


/*
使用說明:
   
全畫面loading:

// fadeIn
$.hiiirLoading('fadeIn', {
	msg: '測試fadeIn', // loading面板上要顯示的訊息
	time: 1000, // fadeIn的時間, 單位:ms, 預設值: 1000
	isFade: true, // 是否要使用fade遮蔽全部畫面, 預設值: true
	startCallback: function() { // 當開始fadeIn時呼叫
		console.log('fadeIn Start');
	},
	endCallback: function() { // 當fadeIn結束時呼叫
		console.log('fadeIn End');
	}
});

// fadeOut
$.hiiirLoading('fadeOut', {
	time: fadeOut的時間, 單位:ms, 預設值: 1000
	startCallback: function() { // 當開始fadeOut時呼叫
		console.log('fadeOut Start');
	},
	endCallback: function() { // 當fadeOut結束時呼叫
		console.log('fadeOut End');
	}
});

指定區域loading:

// fadeIn
$('#testarea').hiiirLoading('fadeIn', {
	time: 1000, // fadeIn的時間, 單位:ms, 預設值: 1000
	isFade: true, // 是否要使用fade遮蔽全部畫面, 預設值: true
	startCallback: function() { // 當開始fadeIn時呼叫
		console.log('begin area fadein');
	},
	endCallback: function() { // 當fadeIn結束時呼叫
		console.log('finish area fadein');
	},
	loading: { // loading圖示設定
		//top: 20, // 同等margin-top, 預設值: 0
		//left: 40 // 同等margin-left, 預設值: 0
	},
	fade: { // fade參數設定
		width: '100%', // 寬度, 預設值: '100%'
		height: '100%', // 高度, 預設值: '100%'
		top: 0, // 同等margin-top, 預設值: 0
		left: 0, // 同等margin-left, 預設值: 0
		zindex: 5000, // 同等zindex, 預設值: 5000
		selectors: [ // 其他區塊要跟著用fade遮蔽時, 在此陣列中設定
			{
				selector: $('#sidearea'), // 區塊物件
				settings: {
					width: '100%', // 寬度, 預設值: '100%'
					height: '100%', // 高度, 預設值: '100%'
					top: 0, // 同等margin-top, 預設值: 0
					left: 0, // 同等margin-left, 預設值: 0
					zindex: 5000, // 同等zindex, 預設值: 5000
				}
			},
			{
				selector: $('#anotherarea'),
				settings: {}
			}
			...
		]
	},
});

// fadeOut
$('#testarea').hiiirLoading('fadeOut', {
	time: 1000, // fadeOut的時間, 單位:ms, 預設值: 1000
	startCallback: function() {	// 當開始fadeOut時呼叫
		console.log('begin area fadeout');
	},
	endCallback: function() {	// 當fadeOut結束時呼叫
		console.log('finish area fadeout');
	},
	fade: {
		selectors: [
			{
				selector: $('#sidearea'), // 區塊物件
			},
			{
				selector: $('#anotherarea'),
			}
			...
		]
	}
});
*/


;
(function($, window, document, undefined) {

	var defaultSelector = $('body');

	$.fn.hiiirLoading = function(method, settings) {

		var that = this;
		var settings = $.extend(settings, {
			selector: that.length > 0 ? $(that[0]) : undefined
		});
		var method = method || 'fadeIn';

		var getLoading = function (selector) {
			return selector.find('.hiiirLoading-area');
		};
		var getFade = function(selector) {
			return selector.find('.hiiirLoading-area-fade');
		};



		// 將在div中的fade用的標簽清除掉
		var remove = function(settings) {

			var selector = settings.selector;
			var loading = getLoading(selector);
			var fade = getFade(selector);
			var time = settings.time;
		
			if (loading.length > 0) {
				fade.fadeOut(time, function() {

				});
			}
		};

		var methodHash = {
			'fadeIn': function(settings) {

				var init = function(settings) {

					var loadingHalfWidth = 12.5 // loading mark寬度的一半
					var selector = settings.selector;
					var loading = getLoading(selector);
					var fade = getFade(selector);
					var isFade = settings.isFade;
					var loadingOptions = settings.loading;
					var fadeOptions = settings.fade;

					settings.loading.left = settings.loading.left - loadingHalfWidth;

					if (loading.length == 0) {
						loading = $(document.createElement('div')).addClass('hiiirLoading-area');
					}
					settings.loading = loading;
					selector.append(loading);
					selector.css({position: 'relative'});
					loading.css({
						'margin-top': loadingOptions.top, 
						'margin-left': loadingOptions.left
					});

					if (isFade) {

						if (fade.length == 0) {
							fade = $(document.createElement('div')).addClass('hiiirLoading-area-fade');
							selector.append(fade);
						}
						fade.css({
							'width': fadeOptions.width, 
							'height': fadeOptions.height, 
							'z-index': fadeOptions.zindex, 
							'top': fadeOptions.top, 
							'left': fadeOptions.left
						});

         				if ($.isArray(fadeOptions.selectors)) {

                              var _defaultsSetting = {
                                   width: '100%',
                                   height: '100%',
                                   top: 0,
                                   left: 0,
                                   zindex: 5000
                              };
                              $.each(fadeOptions.selectors, function(index, value) {
                                            
                                   var selector = value.selector;
                                   var setting = $.extend({}, _defaultsSetting, value.settings);
                                   var fade = selector.find('.hiiirLoading-area-fade');

                                   selector.css({position: 'relative'});
                                   if (fade.length == 0) {
                                        fade = $(document.createElement('div')).addClass('hiiirLoading-area-fade');
                                        fade.css({
                                             'width': setting.width,
                                             'height': setting.height,
                                             'z-index': setting.zindex,
                                             'top': setting.top,
                                             'left': setting.left
                                        });
                                        selector.append(fade);
                                   }
                              });
                         }
					}
				};
				

				init(settings);

				var time = settings.time;
				var selector = settings.selector;
				var loading = getLoading(selector);
				var fade = getFade(selector);
				var isFade = settings.isFade;
				var fadeSelectors = settings.fade.selectors;
				var startCallback = settings.startCallback;
				var endCallback = settings.endCallback;

				console.log('after init');
				console.log(fade);


				if (typeof startCallback == 'function') {
					startCallback();
				}
				loading.fadeIn(time, function() {

					if (typeof endCallback == 'function') {
						endCallback();
					}
				});

				if (isFade) {

					fade.fadeIn(time);

					if ($.isArray(fadeSelectors)) {
						$.each(fadeSelectors, function(index, value) {
							console.log(value.selector.find('.hiiirLoading-area-fade'));
							value.selector.find('.hiiirLoading-area-fade').fadeIn(time);
						});
					}
				}
			},
			'fadeOut': function(settings) {

				var selector = settings.selector;
				var time = settings.time;
				var loading = $('.hiiirLoading-area');
				var fade = $('.hiiirLoading-area-fade');
				var fadeSelectors = settings.fade.selectors;
				var startCallback = settings.startCallback;
				var endCallback = settings.endCallback;

				if (typeof startCallback == 'function') {
					startCallback();
				}
				loading.fadeOut(time, function() {

					if (typeof endCallback == 'function') {
						endCallback();
					}
					loading.remove();
				});
				fade.fadeOut(time, function() {
					fade.remove();
				});

				if ($.isArray(fadeSelectors)) {
					$.each(fadeSelectors, function(index, value) {

						var fade = value.selector.find('.hiiirLoading-area-fade');

						fade.fadeOut(time, function() {
							fade.remove();
						});
					});
				}
			}
		};
		var defaultSettingsHash = {
			'fadeIn': {
				selector: defaultSelector,
				time: 1000,
				isFade: true,
				startCallback: null,
				endCallback: null,
				loading: {
					top: 0,
					left: 0
				},
				fade: {
					width: '100%',
					height: '100%',
					top: 0,
					left: 0,
					zindex: 5000,
					selectors: []
				}
			},
			'fadeOut': {
				selector: defaultSelector,
				time: 1000,
				startCallback: null,
				endCallback: null
			}
		};

		if (typeof methodHash[method] == 'function') {

			settings = $.extend({}, defaultSettingsHash[method], settings);
			methodHash[method](settings);
		}
	};


	// 不需帶select
	$.hiiirLoading = function(method, settings) {


		var defaultSettingsHash = {
			'fadeIn': {
				selector: defaultSelector,
				msg: '',
				time: 1000,
				isFade: true,
				startCallback: null,
				endCallback: null
			},
			'fadeOut': {
				time: 1000,
				startCallback: null,
				endCallback: null
			}
		};

		var methodHash = {
			'fadeIn': function(settings) {

				var loading = $('.hiiirLoading-full');
				var fade = $('.hiiirLoadind-full-fade');

				// 確認loading與fade的div是否存在, 不存在在dom中插入一個
				if (loading.length == 0) {
					console.log('create loading');
					loading = $(document.createElement('div')).addClass('hiiirLoading-full');
					icon = $(document.createElement('span')).addClass('icon');
					title = $(document.createElement('h1')).addClass('title');
					loading.append(icon);
					loading.append(title);
					loading.appendTo(settings.selector);
				}
				if (fade.length == 0) {
					fade = $(document.createElement('div')).addClass('hiiirLoading-full-fade');
					fade.appendTo(settings.selector);
				}
				
				loading.children('.title').html(settings.msg);

				if (typeof settings.startCallback == 'function') {
					settings.startCallback();
				}

				if (settings.isFade) {
					fade.fadeIn(settings.time);
				}
				loading.fadeIn(settings.time, function() {

					if (typeof settings.endCallback == 'function') {
						settings.endCallback();
					}
				});
			},
			'fadeOut': function(settings) {

				var loading = $('.hiiirLoading-full');
				var fade = $('.hiiirLoading-full-fade');

				if (loading.length != 0) {

					if (typeof settings.startCallback == 'function') {
						settings.startCallback();
					}
					loading.fadeOut(settings.time, function() {

						if (typeof settings.endCallback == 'function') {
							settings.endCallback();
						}
					});
				} 

				if (fade.length != 0) {
					fade.fadeOut(settings.time);
				}
			}
		};

		if (typeof methodHash[method] == 'function') {

			settings = $.extend({}, defaultSettingsHash[method], settings);
			methodHash[method](settings);
		}
	}
})(jQuery, window, document);
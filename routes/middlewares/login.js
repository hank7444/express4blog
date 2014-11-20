// 有些ajax需要判斷登入就做在這裏，如果發現不是登入狀態就跳出訊息並導頁到登入頁
var login = function(msg) {

	return function(req, res, next) {

		var uid = (req.session.user && req.session.user._id) ? req.session.user._id : null;
		msg = msg || '請先登入喔！';

        if (!uid) {
            res.status(200).json({
                status: 'login',
                msg: msg
            });
            res.end();
            return false;
        }
        next();
	};
};
module.exports = login;
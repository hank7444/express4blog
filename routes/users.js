var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});



router.route('/register')
	  .get(function(req, res) {
		res.render('users/register', {});
		res.end();
	  })
	  .post(function(req, res) {

	  });

router.route('/signin')
	  .get(function(req, res) {
	  	res.render('users/signin', {
	  		title: 'signin',
	  		js: [
	  			'/javascripts/lib/jquery_plugin/jquery.validate.1.11.1.min.js',
	  			'/javascripts/signin.js'
	  		]
	  	});
	  })
	  .post(function(req, res) {

	  });
module.exports = router;
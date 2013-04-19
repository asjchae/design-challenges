
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.login = function(req, res) {
    req.session.url = '/fetch';
	res.render('login', {title: "Sign In"});
};
var everyauth = require('everyauth');


/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.login = function(req, res) {
  res.send("log in");
    // req.session.url = '/fetch';
	// res.render('login', {title: "Sign In"});
};
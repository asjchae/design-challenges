var everyauth = require('everyauth');


/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.logintest = function(req, res) {
	res.render('login', {title: "Sign In"});
};

exports.signuptest = function(req, res) {

};
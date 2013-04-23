
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};



exports.login = function(req, res) {
    console.log("hi");
    // req.session.url = '/fetch';
	// res.render('login', {title: "Sign In"});
}

exports.complile = function(req, res){
    res.render("compiler");
};
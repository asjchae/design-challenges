
/*
 * GET home page.
 */

exports.index = function(req, res){
  if (!req.session.teamname) {
        res.render('index', { title: 'Team Up', page: 'login' });
    }
  else {return res.redirect('/teampage')};
};

exports.about = function(req, res) {
	res.render('about', {title: 'About', page: 'about'});
}
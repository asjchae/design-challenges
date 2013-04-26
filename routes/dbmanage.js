var Team = require('../models/teammodel')
    , mongoose = require('mongoose');

exports.teams = function(req, res) {
	var allTeams = Team.find({}).sort('teamname').exec(function(err, response) {
		if (err) {
			console.log("Error finding all teams", err);
		} else {
			res.send(response);
		}
	});
};


exports.deleteteams = function(req, res) {
	var deleteAll = Team.find({}).remove();
	res.redirect('/teams');
}
var Team = require('../models/teammodel')
    , mongoose = require('mongoose')
    , Challenge = require('../models/challengemodel');

// Lists all the teams.
exports.teams = function(req, res) {
	var allTeams = Team.find({}).sort('teamname').exec(function (err, response) {
		if (err) {
			console.log("Error finding all teams", err);
		} else {
			res.send(response);
		}
	});
};

// Deletes all the teams.
exports.deleteteams = function(req, res) {
	var deleteAll = Team.find({}).remove();
	res.redirect('/teams/view');
};

// Lists all the challenges.
exports.challenges = function(req, res) {
	var allChallenges = Challenge.find({}).sort('name').exec(function (err, response) {
		if (err) {
			console.log("Error finding all challenges", err);
		} else {
			res.send(response);
		}
	});
};

// Deletes all the challenges.
exports.deletechallenges = function(req, res) {
	var deleteAll = Challenge.find({}).remove();
	res.redirect('/challenges/view');
};
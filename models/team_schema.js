var mongoose = require('mongoose');


var team_schema = mongoose.Schema({
	teamname: String,
	password: String
});

var Team = mongoose.model('Team', team_schema);

module.exports = Team;
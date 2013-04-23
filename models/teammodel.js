var mongoose = require('mongoose')

var teamschema = mongoose.Schema({ 
    teamname: String,
    captain: {name: String, email: String},
    members: [{name: String, email: String}],
    score: Number,
    interests: [{interest: String, completions: Number}], 
    picture: String,
    projects: [{projectname: String, }]
});

var team = mongoose.model('Team', teamschema);

exports.team = team;

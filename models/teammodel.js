var mongoose = require('mongoose')

var teamschema = mongoose.Schema({ 
    teamname: String,
    password: String,
    captain: {name: String, email: String},
    members: [{name: String, email: String}],
    score: Number,
    prizescore: Number,
    // Update this later with an object type. 
    // createdchallenges: [{name: String, prizegiven: Boolean}],
    interests: [{interest: String, completions: Number}], 
    picture: String,
    // projects: [{projectname: String}]
    projects: Array,
    createdchallenges: Array
    // challengescreated: Array
});

var Team = mongoose.model('Team', teamschema);

module.exports = Team;

var  Team = require('../models/teammodel')
    , Challenge = require('../models/challengemodel')
    , mongoose = require('mongoose');


exports.addchallenge = function(req, res){
    res.render('addchallenge', {title: "Create Challenge", page:'add'});
};

exports.addchallengepost = function(req, res){

    // Check to see if logged in.
    if (req.session.teamname == undefined) {
        return res.redirect('/login');
    };
    
    // Save the challenge.

    var date = new Date();
    var month = date.getMonth() + 1;
    var number = date.getDate();
    var year = date.getFullYear();
    var d = month + "/" + number + "/" + year;


    var challenge = new Challenge({name: req.body.name, type: req.body.type, 
                        prompt: req.body.prompt, description: req.body.description, 
                        createdby: req.session.teamname, prize: req.body.prize, status: "Open", datecreated: d});
    challenge.save(function (err) {
        if (err) {
            console.log("Problem signing team up", err);
            res.redirect('/addchallenge');
        } else {
            // Add the challenge to the team that created it.
            Team.findOne({teamname: req.session.teamname}).exec(function (err, response) {
                var createdchals = response.challengescreated;
                createdchals.push(req.body.name);
                Team.update({teamname: req.session.teamname}, {challengescreated: createdchals}, {upsert: true}, function (err) {
                    return res.redirect('/challengepage/' + req.body.name);
                });
            });
        };
    });
};



exports.challengebrowser = function(req, res){
    var allChallenges = Challenge.find({}).exec(function (err, data) {
        if (err) {
            res.send("Could not find all challenges");
        } else {
            challengepacker(data, res, function (res, challenge) {
                res.render('challengebrowser', {title: "Challenge Browser", challengepack: challenge, page: 'browser'});
            })
        }
    });
};

// Function to sort through array of all challenges.
function challengepacker(data, res, callback) {
    var challenge = [];
    for (var i = 0; i<data.length; i++) {
        challenge.push(data[i]);
    } 
    callback(res, challenge);
};



exports.selectchallenge = function(req, res){
    if (req.session.teamname == undefined) {
        return res.json({redirect: '/login'});
    }

    // Find the team, add that challenge to the team.

    Team.findOne({teamname: req.session.teamname}).exec(function (err, response) {
        var teamprojects = response.projects;
        for (var i=0; i<teamprojects.length; i++) {
            if (teamprojects[i] == req.body.projectname) {
                // Redirect to the challenge page.
                return res.json({redirect: '/challengepage/' + req.body.projectname});
            }
        }
        teamprojects.push(req.body.projectname);
        Team.update({teamname: req.session.teamname}, {projects: teamprojects}, {upsert: true}, function (err) {
            // Redirect to the challenge page.
            return res.json({redirect: '/challengepage/' + req.body.projectname});
        });
    });
};

exports.submitchallenge = function(req, res){
    res.send("Needs to be implemented");
};


exports.challengepage = function(req, res){
    var allChallenges = Challenge.findOne({name: req.params.selected}).exec(function (err, data) {
        console.log(data);
        if (err) {
            res.send("Could not find challenge");
        } else {
            res.render('challengepage', {title: req.params.selected, challenge: data, page: 'challenge'});
        }
    });
};

exports.drop = function(req, res) {
    if (req.session.teamname == undefined) {
        return res.json({redirect: '/login'});
    }
    Team.findOne({teamname: req.session.teamname}).exec(function (err, response) {
        var teamprojects = response.projects;
        for (var i=0; i<teamprojects.length; i++) {
            if (teamprojects[i] == req.body.projectname) {
                teamprojects.splice(i);
            }
        }
        Team.update({teamname: req.session.teamname}, {projects: teamprojects}, {upsert: true}, function (err) {
            return res.json({redirect: '/challengebrowser'});
        });
    });
};
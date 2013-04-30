var  Team = require('../models/teammodel')
    , Challenge = require('../models/challengemodel')
    , mongoose = require('mongoose');


exports.addchallenge = function(req, res){
    res.render('addchallenge', {title: "Log In"});
};

exports.addchallengepost = function(req, res){
    console.log(req.body) 
    var challenge = new Challenge({name: req.body.name, type: req.body.type, 
                        prompt: req.body.prompt, description: req.body.description, 
                        contactname: req.body.contactname, email: req.body.email});
    challenge.save(function (err) {
        if (err) {
            console.log("Problem signing team up", err);
            res.send("Wow there friend, you may need to slow down!");
        } else {
            res.send("Your challenge is added! " + req.body.name + "!");
        }
    });
};

exports.challengebrowser = function(req, res){
    var allChallenges = Challenge.find({}).exec(function (err, data) {
        if (err) {
            res.send("Could not find all challenges");
        } else {
            challengepacker(data, res, function (res, challenge) {
                res.render('challengebrowser', {title: "Challenge Browser", challengepack: challenge});
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

    Team.find({teamname: req.session.teamname}).exec(function (err, response) {
        if (err) {
            console.log("error", err);
            return res.json({redirect: '/login'});
        } else {
            response.set({projects: [req.body.projectname]}); // WAIT BUT ACTUALLY I DON'T KNOW HOW TO DO THIS ANYMORE
            console.log(response);
            response.save(function (err) {
                if (err) {
                    console.log("Error adding project to team", err);
                } else {
                    return res.json({redirect: '/'});
                }
            });
        }
    });



    // Redirect to the challenge page.
    console.log(req.session.teamname);
    console.log(req.body.projectname)
};

exports.submitchallenge = function(req, res){
    res.send("Needs to be implemented");
};

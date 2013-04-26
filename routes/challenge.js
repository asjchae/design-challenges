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

            res.send("WOw there friend, you may need to slow down!");
        } else {
            res.send("You're challenge is added! " + req.body.name + "!");
        }
    });
};

exports.challengebrowser = function(req, res){
    res.send("Needs to be implemented");
};

exports.selectchallenge = function(req, res){
    res.send("Needs to be implemented");
};

exports.submitchallenge = function(req, res){
    res.send("Needs to be implemented");
};

var  Team = require('../models/teammodel')
    , Challenge = require('../models/projectmodel');
    , mongoose = require('mongoose');


exports.addchallenge = function(req, res){
    res.send("Needs to be implemented");
};

exports.addchallengepost = function(req, res){
  
    var team = new Challenge({name: req.body.name, type: req.body.type, 
                        promt: req.body.prompt, description: req.body.description, 
                        contactname: req.body.contactname, email: req.body.email});

    res.send("Needs to be implemented");
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

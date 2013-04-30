var  Team = require('../models/teammodel')
    , Challenge = require('../models/challengemodel')
    , mongoose = require('mongoose');

var querystring = require("querystring");
var fs = require("fs");
var formidable = require ("formidable");



exports.addchallenge = function(req, res){
    res.render('addchallenge', {title: "Add Challenge", page:'add'});
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
            res.redirect('/challengebrowser');
        }
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
    res.render('submit', {title: "Submit Challenge", page: ''});
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


exports.upload = function(request, response){
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
    console.log("parsing done");

    /* Possible error on Windows systems:
       tried to rename to an already existing file */
    fs.rename(files.upload.path, "/tmp/test.png", function(err) {
      if (err) {
        fs.unlink("/tmp/test.png");
        fs.rename(files.upload.path, "/tmp/test.png");
      }
    });
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("received image:<br/>");
    response.write("<img src='/show' />");
    response.end();
  });
}
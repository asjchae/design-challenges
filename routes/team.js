var bcrypt = require('bcrypt')
    , Team = require('../models/team_schema')
    , mongoose = require('mongoose');


/*
 * GET users listing.
 */

exports.list = function(req, res){
    res.send("respond with a resource");
};

exports.login = function(req, res) {
    res.render('login', {title: "Log In"});
};

exports.loginpost = function(req, res) {
    var team = Team.findOne({teamname: req.body.teamname}).exec(function (err, teamdata) {
        if (err) {
            return console.log("Could not find team name", err);
        } else {
            bcrypt.compare(req.body.pwd, teamdata.password, function (err, boolean) {
                if (boolean == true) {
                    // Log them in.
                } else if (boolean == false) {
                    // Tell them to re-enter the password
                }
            });
        }
    });
};

exports.signup = function(req, res) {
    res.render('signup', {title: "Sign Up"});
};

exports.signuppost = function(req, res) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.pwd, salt, function(err, hash) {
            var team = new Team({teamname: req.body.teamname, password: hash});
            team.save(function (err) {
                if (err) {
                    console.log("Problem signing team up", err);
                } else {
                    res.send("You are now signed up, " + req.body.teamname + "!");
                }
            });
        });
    });
};

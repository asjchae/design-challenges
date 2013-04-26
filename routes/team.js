var bcrypt = require('bcrypt')
    , Team = require('../models/teammodel')
    , mongoose = require('mongoose');

// Login page.
exports.login = function(req, res) {
    res.render('login', {title: "Log In"});
};

// Login post.
exports.loginpost = function(req, res) {
    var team = Team.findOne({teamname: req.body.teamname}).exec(function (err, teamdata) {
        if (err) {
            return console.log("Could not find team name", err);
        } else {
            bcrypt.compare(req.body.pwd, teamdata.password, function (err, boolean) {
                if (boolean == true) {
                    console.log("Logged in " + req.body.teamname);
                    res.redirect('/');
                } else if (boolean == false) {
                    res.redirect('/login'); // Just takes you back to log in screen, maybe we can add a cool error message later.
                }
            });
        }
    });
};


// Sign up page.
exports.signup = function(req, res) {
    res.render('signup', {title: "Sign Up"});
};


// Sign up post.

exports.signuppost = function(req, res) {
    var checkname = Team.findOne({teamname: req.body.teamname}).exec(function (err, data) {
        if (err) {
            console.log("Could not search for existing team", err);
        } else if (!data) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.pwd, salt, function(err, hash) {
                    var team = new Team({teamname: req.body.teamname, password: hash});
                    team.save(function (err) {
                        if (err) {
                            console.log("Problem signing team up", err);
                        } else {
                            res.redirect('/'); // Redirecting to home after signing up, for now.
                        }
                    });
                });
            });
        } else {
            res.send("Already a user.") // Should probably redirect to log in screen? Like, "Redirecting in 5...4...3..."
        }
    });
};

exports.teampage = function(req, res){
    res.send("Needs to be implemented");
};

exports.leaderboard = function(req, res){
    res.send("Needs to be implemented");
};
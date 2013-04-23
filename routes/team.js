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

exports.logintest = function(req, res) {
    // Put checking hash stuff here.
};

exports.signup = function(req, res) {
    res.render('signup', {title: "Sign Up"});
};

exports.signuptest = function(req, res) {
    console.log(req.body.teamname);
    bcrypt.genSalt(10, function(err, salt) {
        console.log('a');
        bcrypt.hash(req.body.pwd, salt, function(err, hash) {
            console.log('b');
            var team = new Team({teamname: req.body.teamname, password: hash});
            console.log('b.1');
            console.log(team);
            team.save(function (err) {
                console.log('c');
                if (err) {
                    console.log("Problem signing team up", err);
                } else {
                    console.log('d');
                    res.send("You are now signed up!");
                }
            });
            console.log('asyncccccmeow');
        });
    });
};

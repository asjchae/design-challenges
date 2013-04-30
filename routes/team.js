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
                    login(req, res, team);
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
    console.log(req.body)
    var checkname = Team.findOne({teamname: req.body.teamname}).exec(function (err, data) {
        if (err) {
            console.log("Could not search for existing team", err);
        } else if (!data) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(req.body.pwd, salt, function(err, hash) {
                    var interests = []
                    for (i in req.body.interests) {
                        interests.push({'interest':req.body.interests[i], 'completions':0})
                    }
                    var members = []
                    for (m in req.body.member) {
                        members.push({'name':req.body.member[m], 'email':req.body.emailmember[m]})
                    }
                    var team = new Team({
                        teamname: req.body.teamname, 
                        password: hash,
                        captain: {'name': req.body.captain, 'email': req.body.emailcaptain},
                        members: members,
                        interests: interests
                        });
                    req.session.teamname=req.body.teamname
                    console.log(req.session)
                    team.save(function (err) {
                        if (err) {
                            console.log("Problem signing team up", err);
                        } else {
                            login(req, res, team);
                        }
                    });
                });
            });
        } else {
            res.send("Username is already taken.") // Should probably redirect to log in screen? Like, "Redirecting in 5...4...3..."
        }
    });
};

exports.teampage = function(req, res){
    var team = Team.find({teamname:req.session.teamname}).exec(function (err, data) {
        if (err) {
            res.send("Could not find team");
        } else {
            var myteam = data[0]
            var interests = [];
            for (var i=0; i<myteam.interests.length; i++) {
                interests.push(myteam.interests[i].interest);
            }
            console.log(interests);
            res.render('teampage', {title: "Team Page", teamname:myteam.teamname, projects:myteam.projects, interests:interests, members: myteam.members, captain: myteam.captain});
        }
    });
};

exports.leaderboard = function(req, res){
    res.send("Needs to be implemented");
};

// Sessions
function login(req, res, team) {
    req.session.teamname = req.body.teamname;
    return res.redirect('/');
}
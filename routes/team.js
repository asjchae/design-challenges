var bcrypt = require('bcrypt')
    , Team = require('../models/teammodel')
    , Challenge = require('../models/challengemodel')
    , mongoose = require('mongoose');

// Login page.
exports.login = function(req, res) {
    res.render('login', {title: "Log In", page: 'login'});
};

// Login post.
exports.loginpost = function(req, res) {
    var team = Team.findOne({teamname: req.body.teamname}).exec(function (err, teamdata) {
        if (err) {
            return console.log("Could not find team name", err);
        } else if (!teamdata) {
            res.redirect('/signup');
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
    res.render('signup', {title: "Sign Up", page: 'login'});
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
                    // console.log(req.session)
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
    console.log(req.session)
    if (!req.session.teamname) {    
        return res.redirect('/');
    }
    else {
        return res.redirect('/team/'+req.session.teamname)
    }
}

exports.teamcheck = function(req, res){
    var team = Team.find({teamname:req.params.teamname}).exec(function (err, data) {
        if (err) {  
            res.send("Could not find team");
        } else {
            var myteam = data[0];
            var interests = "";
            for (var i=0; i<myteam.interests.length; i++) {
                interests = interests.concat( "  " +(myteam.interests[i].interest) + "  ");
            }

            teamprojects(myteam, function(openprojects, closedprojects, opencreated, closedcreated) {
                res.render('teampage', {page: 'team', title: "Team Page", teamname:myteam.teamname,
                    openchallengescreated: opencreated, closedchallengescreated: closedcreated,
                    openprojects: openprojects, closedprojects: closedprojects, interests:interests,
                    members: myteam.members, captain: myteam.captain});
            });
        }
    });
};

function teamprojects(myteam, callback) {
    var openprojects = [];
    var closedprojects = [];
    var callbacktracker = [];

    if (myteam.projects.length == 0) {
        teamchallenges(myteam, function(opencreated, closedcreated) {
            callback(openprojects, closedprojects, opencreated, closedcreated);
        });
    }

    for (var p=0; p<myteam.projects.length; p++) {
        Challenge.findOne({name: myteam.projects[p]}).exec(function (err, response) {
            if (!response) {
                callbacktracker.push('.');
                if (callbacktracker.length == myteam.projects.length) {
                    teamchallenges(myteam, function(opencreated, closedcreated) {
                        callback(openprojects, closedprojects, opencreated, closedcreated);
                    });
                }
            } else {
                if (response.status == "Open") {
                    var today = new Date();
                    var comparedate = response.dateclosed;

                    if (comparedate > today) {
                        // not yet closed
                        openprojects.push({proj:response.name, url:'/challengepage/'+response.name});

                        callbacktracker.push('.');
                        if (callbacktracker.length == myteam.projects.length) {
                            teamchallenges(myteam, function(opencreated, closedcreated) {
                                callback(openprojects, closedprojects, opencreated, closedcreated);
                            });
                        }
                    } else {
                        // closed
                        closedprojects.push({proj: response.name, url:'/challengepage/' + response.name});
                        callbacktracker.push('.');
                        if (callbacktracker.length == myteam.projects.length) {
                            teamchallenges(myteam, function(opencreated, closedcreated) {
                                callback(openprojects, closedprojects, opencreated, closedcreated);
                            });
                        }
                    }

                } else if (response.status == "Closed") {
                    closedprojects.push({proj:response.name, url:'/challengepage/'+response.name});
                    callbacktracker.push('.');
                    if (callbacktracker.length == myteam.projects.length) {
                        teamchallenges(myteam, function(opencreated, closedcreated) {
                            callback(openprojects, closedprojects, opencreated, closedcreated);
                        });
                    }
                }
            }
        });
    }
}




function teamchallenges(myteam, callback) {
    var opencreated = [];
    var closedcreated = [];
    var callbacktracker = [];

    console.log(myteam.createdchallenges);
    if (myteam.createdchallenges.length == 0) {
        callback(opencreated, closedcreated);
    }
    for (var c=0; c<myteam.createdchallenges.length; c++) {
        // check that the project is live
        Challenge.findOne({name: myteam.createdchallenges[c]}).exec(function (err, response) {
            if (!response) {
                callbacktracker.push('.');
                if (callbacktracker.length == myteam.createdchallenges.length) {
                    callback(opencreated, closedcreated);
                }
            } else {
                if (response.status == "Open") {

                    var today = new Date();
                    var comparedate = response.dateclosed;

                    if (comparedate > today){
                        // Not yet closed.
                        opencreated.push({chal: response.name, url:'/challengepage/'+response.name});
                        callbacktracker.push('.');
                        if (callbacktracker.length == myteam.createdchallenges.length) {
                            callback(opencreated, closedcreated);
                        }
                    } else {
                        closedcreated.push({chal: response.name, url:'/challengepage/'+response.name});
                        callbacktracker.push('.');
                        if (callbacktracker.length == myteam.createdchallenges.length) {
                            callback(opencreated, closedcreated);
                        }
                    }

                } else if (response.status == "Closed") {
                    closedcreated.push({chal: response.name, url:'/challengepage/'+response.name});
                    callbacktracker.push('.');
                    if (callbacktracker.length == myteam.createdchallenges.length) {
                        callback(opencreated, closedcreated);
                    }
                }
            }
        });
    }
}

exports.leaderboard = function(req, res){
    res.send("Needs to be implemented");
};

// Sessions
function login(req, res, team) {
    req.session.teamname = req.body.teamname;
    return res.redirect('/challengebrowser');
}

exports.logout = function(req, res) {
    req.session.destroy();
    return res.redirect('/');
}

exports.checkname = function(req, res) {
    Team.findOne({teamname: req.body.teamname}).exec(function (err, response) {
        if (!response) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
}
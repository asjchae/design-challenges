var  Team = require('../models/teammodel')
    , Challenge = require('../models/challengemodel')
    , mongoose = require('mongoose');

var querystring = require("querystring");
var fs = require("fs");
var formidable = require ("formidable");



exports.addchallenge = function(req, res){
    if (!req.session.teamname) {
        return res.redirect('/');
    }
    res.render('addchallenge', {title: "Create Challenge", page:'add'});
};

exports.addchallengepost = function(req, res){

    // Check to see if logged in.
    if (req.session.teamname == undefined) {
        return res.redirect('/');
    };
    
    // Save the challenge.

    var date = new Date();
    var month = date.getMonth() + 1;
    if (month.toString().length == 1) {
        month = "0".concat(month);  
    }
    var number = date.getDate();
    if (number.toString().length == 1) {
        number = "0".concat(number);
    }
    var year = date.getFullYear();

    var d = year + "/" + month + "/" + number;   
    var finishDate = req.body.datepicker.split("/");
    var finish = finishDate[2] + "/" + finishDate[0] + "/" + finishDate[1];
    var date2 = new Date(finishDate[2], finishDate[0]-1, finishDate[1]);

    var status = "Open";
    if (date2 < date) {
        status = "Closed";
    }

    var challenge = new Challenge({name: req.body.name, type: req.body.type, 
                        prompt: req.body.prompt, description: req.body.description, 
                        createdby: req.session.teamname, prize: req.body.prize, status: status,
                        created: d, closed:finish, datecreated: date, dateclosed: date2});

    challenge.save(function (err) {
        if (err) {
            console.log("Problem signing team up", err);
            res.redirect('/addchallenge');
        } else {
            // Add the challenge to the team that created it.
            Team.findOne({teamname: req.session.teamname}).exec(function (err, response) {
                var createdchals = response.createdchallenges;
                createdchals.push(req.body.name);
                Team.update({teamname: req.session.teamname}, {createdchallenges: createdchals}, {upsert: true}, function (err) {
                    return res.redirect('/viewchallenge/' + req.body.name);
                });
            });
        };
    });
};



exports.challengebrowser = function(req, res){
    var loggedin='yes'
    if (!req.session.teamname) {
        loggedin='no'
    }

    var allChallenges = Challenge.find({}).exec(function (err, data) {
        if (err) {
            res.send("Could not find all challenges");
        } else if (data.length == 0) {
            res.render('challengebrowser', {title: "Challenge Browser", challengepack: [], page: 'browser', loggedin: loggedin});
        } else {
            challengepacker(data, res, function (res, challenge) {
                res.render('challengebrowser', {title: "Challenge Browser", challengepack: challenge, page: 'browser', loggedin: loggedin});
            })
        }
    });
};

// Function to sort through array of all challenges.
function challengepacker(data, res, callback) {
    var challenge = [];
    var allofthem = [];
    for (var i = 0; i<data.length; i++) {
        var chal = Challenge.findOne({name: data[i].name}).exec(function (err, response) {

        // CHECK FOR OPEN/CLOSE HERE.
            if (response.status == "Open") {
                var today = new Date();
                var comparedate = response.dateclosed;

                if (comparedate > today) {
                    // Not yet closed.
                    challenge.push(response);
                    allofthem.push(response);
                    if (allofthem.length == data.length) {
                        callback(res, challenge);
                    }
                } else {
                    allofthem.push(response);
                    if (allofthem.length == data.length) {
                        callback(res, challenge);
                    }
                }
            } else if (response.status == "Closed") {
                allofthem.push(response);
                if (allofthem.length == data.length) {
                    callback(res, challenge);
                }
            }
        });
    }
};

exports.viewchallenge = function(req, res){
    if (req.session.teamname == undefined) {
        return res.redirect('/');
    }
    Team.findOne({teamname: req.session.teamname}).exec(function (err, response) {
        var teamprojects = response.projects;

        for (var i=0; i<=teamprojects.length; i++) {
            if (teamprojects[i] == req.params.selected) {
                console.log(teamprojects[i],req.params.selected)
                var mine = 'true'
            }
            var allChallenges = Challenge.findOne({name: req.params.selected}).exec(function (err, data) {
                if (data.status == "Open") {
                    var today = new Date();
                    var comparedate = data.dateclosed;

                    if (comparedate < today) {
                        Challenge.update({name: data.name}, {status: "Closed"}, {upsert: true}, function (err) {
                            if (err) {
                                console.log("Error", err);
                            }
                            return res.render('challengepage', {title: data.name, challenge: data, mine: mine, page: 'challenge'});
                        });
                    };
                };

                if (err) {
                    res.redirect('/challengebrowser')
                } else {
                    console.log(data, 'dude')
                    return res.render('challengepage', {title: data.name, challenge: data, mine: mine, page: 'challenge'});
                };
            });
        }
    });
};

exports.acceptchallenges = function(req,res){
    Team.findOne({teamname: req.session.teamname}).exec(function (err, response) {
        var teamprojects = response.projects;
        teamprojects.push(req.body.name);
        console.log(req.body)
        Team.update({teamname: req.session.teamname}, {projects: teamprojects}, {upsert: true}, function (err) {
            // Redirect to the challenge page.
            if (req.body.name == req.session.teamname) {
                return res.render('challengecreator', {title: req.body.name, challenge: req.body, mine: true, page: 'challenge', status: 'open'});
            } else {
                return res.render('challengepage', {title: req.body.name, challenge: req.body, mine: true, page: 'challenge', status: 'open'});    
            }
            
        });
    });
}

exports.submitchallenge = function(req, res){
    Challenge.findOne({name: req.body.challengename}).exec(function (err, data) {
        var submissions = data.submissions;
        submissions.push([req.body.submission, req.session.teamname]);
        Challenge.update({name: data.name}, {submissions: submissions}, {upsert: true}, function (err) {
            if (err) {
                console.log("Error", err);
                res.redirect('/challengepage/' + data.name);
            }
            return res.render('challengepage', {title: req.body.challengename, status: 'open', challenge: data, page: 'challenge'});
        });
    });
};

exports.pickwinner = function(req, res) {
    var winner = req.body.winner.split('_')[0];
    var winninglink = req.body.winner.split('_')[1];
    var challengename = req.body.winner.split('_')[2];
    console.log(winner);
    console.log(winninglink);
    console.log(challengename);

    Challenge.findOne({name: challengename}).exec(function (err, data) {
        var win = [winner, winninglink];
        Challenge.update({name: data.name}, {winner: win, status: "Closed"}, {upsert: true}, function (err) {
            if (err) {
                console.log("Error", err);
                res.redirect('/challengepage/' + data.name);
            }
            res.render('challengecreator', {title: data.name, challenge: data, status: 'closed', page: 'challenge'});
        });
    });
};

exports.challengepage = function(req, res){
    var allChallenges = Challenge.findOne({name: req.params.selected}).exec(function (err, data) {
        console.log(req.session.teamname);
        console.log(data.createdby);
        if (req.session.teamname == data.createdby) {

            if (data.winner.length > 1) {
                return res.render('challengecreator', {title: data.name, challenge: data, status: 'closed', page: 'challenge'});
            }

            if (data.status == "Open") {
                var today = new Date();
                var comparedate = data.dateclosed;

                if (comparedate < today) {
                    Challenge.update({name: data.name}, {status: "Closed"}, {upsert: true}, function (err) {
                        if (err) {
                            console.log("Error", err);
                            res.redirect('/challengepage/' + data.name);
                        }
                        return res.render('challengecreator', {title: data.name, challenge: data, status: 'open', submissions: data.submissions, page: 'challenge'});
                    });
                }
            }

            if (err) {
                res.redirect('/challengebrowser')
            } else {
                res.render('challengecreator', {title: req.params.selected, submissions: data.submissions, status: 'open', challenge: data, page: 'challenge'});
            }
        } else {

            if (data.winner.length > 1) {
                return res.render('challengepage', {title: data.name, challenge: data, status: 'closed', page: 'challenge'});
            }

            if (data.status == "Open") {
                var today = new Date();
                var comparedate = data.dateclosed;

                if (comparedate < today) {
                    Challenge.update({name: data.name}, {status: "Closed"}, {upsert: true}, function (err) {
                        if (err) {
                            console.log("Error", err);
                        }
                        return res.render('challengepage', {title: data.name, status: 'open', challenge: data, page: 'challenge'});
                    });
                }
            }

            if (err) {
                res.redirect('/challengebrowser')
            } else {
                res.render('challengepage', {title: req.params.selected, challenge: data, status: 'open', page: 'challenge'});
            }
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

exports.drop = function(req, res) {
    if (req.session.teamname == undefined) {
        return res.json({redirect: '/'});
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
    

exports.checkname = function(req, res) {
    Challenge.findOne({name: req.body.challengename}).exec(function (err, response) {
        if (!response) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
}


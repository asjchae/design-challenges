
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , team = require('./routes/team')
  , http = require('http')
  , path = require('path')
  , challenge = require('./routes/challenge')
  , team = require('./routes/team')
  , bcrypt = require('bcrypt')
  , mongoose = require('mongoose')
  , dbmanage = require('./routes/dbmanage')
  , index = require('./routes/index');

var app = express();
mongoose.connect(process.env.MONGOLAB_URI || 'localhost/designchallenges');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser(process.env.SECRET || 'fake_secret'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);




// Authentication.
app.get('/login', team.login);
app.post('/login', team.loginpost);

app.get('/signup', team.signup);
app.post('/signup', team.signuppost);

app.get('/logout', team.logout);

app.get('/team/:teamname', team.teamcheck);
app.get('/teampage', team.teampage);
//app.get('/team/:teamname', team.teampagebrowser);

app.get('/leaderboard', team.leaderboard);

app.get('/addchallenge', challenge.addchallenge);
app.post('/addchallenge', challenge.addchallengepost);

app.get('/challengebrowser', challenge.challengebrowser);

app.post('/drop', challenge.drop);

app.post('/selectchallenge', challenge.selectchallenge);

app.get('/about', index.about);

// app.post('/selectchallenge/:selected', function(req,res){
//   challenge.selectchallenge(req, res, req.params.selected)
// });
  //challenge.selectchallenge);


// This one needs work, how do we do that thing where we we can write anything and it parses it
app.get('/challengepage/:selected', challenge.challengepage);

app.post('/submitchallenge', challenge.submitchallenge);
app.post('/upload', challenge.upload)

app.post('/checkchallenge', challenge.checkname)
app.post('/checkteam', team.checkname)
app.post('/pickwinner', challenge.pickwinner)

// Database administrative test routes.
app.get('/teams/view', dbmanage.teams);
app.get('/teams/delete', dbmanage.deleteteams);
app.get('/challenges/view', dbmanage.challenges);
app.get('/challenges/delete', dbmanage.deletechallenges);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

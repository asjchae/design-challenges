
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , team = require('./routes/team')
  , http = require('http')
  , path = require('path')
  , bcrypt = require('bcrypt')
  , mongoose = require('mongoose');

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
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);


// Authentication.
app.get('/login', team.login);
app.post('/loginpost', team.loginpost);

app.get('/signup', team.signup);
app.post('/signuppost', team.signuppost);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var mongoose = require('mongoose')

var projectschema = mongoose.Schema({ 
    name: String,
    type: String,
    prompt: String,
    description: String,
    contactname: String, 
    email: String

});
var project = mongoose.model('Project', projectschema);

var twitschema = mongoose.Schema({
  user: String,
  twit:String
});

exports.project = project

var mongoose = require('mongoose')

var challengeschema = mongoose.Schema({ 
    name: String,
    type: String,
    prompt: String,
    description: String,
    createdby: String

});
var Challenge = mongoose.model('Challenge', challengeschema);

module.exports = Challenge;
 
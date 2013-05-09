var mongoose = require('mongoose')

var challengeschema = mongoose.Schema({ 
    name: String,
    type: String,
    prompt: String,
    description: String,
    contactname: String, 
    email: String,
    enddate: Date,
    prize:  String,
    prizerecieved: Boolean  

});
var Challenge = mongoose.model('Challenge', challengeschema);

module.exports = Challenge;
 
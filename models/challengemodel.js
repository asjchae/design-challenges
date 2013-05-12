var mongoose = require('mongoose')

var challengeschema = mongoose.Schema({ 
    name: String,
    type: String,
    prompt: String,
    description: String,
    prizerecieved: Boolean, 

    createdby: String,
    prize: String,
    status: String,
    datecreated: String,
    dateclosed: String
});

var Challenge = mongoose.model('Challenge', challengeschema);

module.exports = Challenge;
 
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
    created: String,
    closed: String,
    datecreated: Date,
    dateclosed: Date,
    submissions: Array,
    winner: Array

});

var Challenge = mongoose.model('Challenge', challengeschema);

module.exports = Challenge;
 
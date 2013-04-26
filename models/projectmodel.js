 var mongoose = require('mongoose')

var projectschema = mongoose.Schema({ 
    progress: Number,
    tasks: [{task: String}],
    completedtasks: [{task: String}],
    messages: [{user: String, message: String, time: Date}]

});

var Project = mongoose.model('Project', projectschema);

module.exports = Project;


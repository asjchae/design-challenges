 var mongoose = require('mongoose')

var projectschema = mongoose.Schema({ 
    progress: Number,
    tasks: [{task: String}],
    completedtasks: [{task: String}],
    messages: [{user: String, message: String, time: Date}]

});

var project = mongoose.model('Project', projectschema);

exports.project = project;


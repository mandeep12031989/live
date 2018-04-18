var mongoose = require('mongoose')
var Schema = mongoose.Schema

var choiceSchema = new Schema({
	cID: {
		type: String,
		default: 'T__Q__C_'
	},
	statement: String
});

var MCQ = new Schema({
    qID: {
		type: String,
		default: 'T__Q__'
	},
	question: String,
	choices: [choiceSchema],
	correct: String
});

module.exports = mongoose.model('openMCQSchema', MCQ);

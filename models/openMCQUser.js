var mongoose = require('mongoose')
var Schema = mongoose.Schema

var openMCQUser = new Schema({
	fullname: String,
	emailID: String,
	contact: String,
	MCQs: Array,
	date: Date,
	sDate: Date,
	device_details: Object,
	status: {
		type: String,
		default: "Not yet"
	}
});

module.exports = mongoose.model('openMCQUser', openMCQUser);
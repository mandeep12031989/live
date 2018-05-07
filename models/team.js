'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamListSchema = new Schema({
    teamID: {
		type: String,
		default: 'T___'
	},
	teamName: String,
	date: Date,
	members: [new Schema({ userID: String, name: String, emailID: String })]
});

module.exports = mongoose.model('teamListSchema', teamListSchema);
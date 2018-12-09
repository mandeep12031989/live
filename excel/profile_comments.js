'use strict';

//IMPORTING
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var json2xls = require('json2xls');
var xlsx = require('xlsx');
var fs = require('fs');

var User = require('../models/user.js');
var Keyword = require('../models/keyword.js');
var config = require('../config.js');

function xyz() {
	// console.log(config.development.mongoUrl);

	// Mongoose Connection
	mongoose.Promise = global.Promise;
	mongoose.connect(config.development.mongoUrl);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
		// we're connected!
		console.log("Connected correctly to server");

		User.find({}, {
			_id: 0, firstname: 1, lastname: 1, 'profile.profile_number': 1,
			// 'profile.eachSectionStopReflect': 1, 'profile.eachSectionStopReflectElse': 1, 
			// 'profile.eachSectionCombineComment': 1
			'profile.profile_content.comment': 1, 'profile.profile_content.keyword_id': 1
		}, (err, users) => {

			var ws_data = [];

			//comments
			users.filter(user => user.profile.profile_number != '0').forEach((user, ui) => {
				// console.log(ui + 1);
				var temp_arr = [user.profile.profile_number, user.firstname + ' ' + user.lastname];
				var comments = user.profile.profile_content.filter((keyword) => keyword.keyword_id[5] == '3').map((keyword) => {
					return keyword.comment ? keyword.comment : null;
				}).filter((cmnt) => cmnt != null);

				if (comments.length) {
					temp_arr.push(...comments);
					// console.log(temp_arr);
					ws_data.push(temp_arr);
				}
			});

			//combinecomments
			// users.filter(user => user.profile.profile_number != '0').forEach((user, ui) => {
			// 	// console.log(ui + 1);
			// 	var temp_arr = [user.profile.profile_number, user.firstname + ' ' + user.lastname];
			// 	var comments = user.profile.eachSectionCombineComment.learning;

			// 	if (comments.length) {
			// 		temp_arr.push(...comments);
			// 		// console.log(temp_arr);
			// 		ws_data.push(temp_arr);
			// 	}
			// });

			//stop&reflect
			// users.filter(user => user.profile.profile_number != '0').forEach((user, ui) => {
			// 	// console.log(ui + 1);
			// 	var temp_arr = [user.profile.profile_number, user.firstname + ' ' + user.lastname];
			// 	var comments = [];
			// 	comments.push(user.profile.eachSectionStopReflectElse.learning.ques2);
			// 	comments.push(user.profile.eachSectionStopReflect[2]);

			// 	if (comments.filter(cmnt => cmnt).length) {
			// 		temp_arr.push(...comments);
			// 		// console.log(temp_arr);
			// 		ws_data.push(temp_arr);
			// 	}
			// });

			var ws = xlsx.utils.aoa_to_sheet(ws_data);

			var wb = xlsx.utils.book_new();

			/* Add the worksheet to the workbook */
			xlsx.utils.book_append_sheet(wb, ws, "Sheet 1");

			xlsx.writeFile(wb, "keyword_comments.xlsx");
			process.exit(0);
		});
	});

}

xyz();
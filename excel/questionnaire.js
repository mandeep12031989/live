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

const questionnaireMapping = [[4, 6], [8, 9], [3, 1], [5, 7], [2, 4], [6, 9], [8, 1], [2, 5], [3, 7], [4, 9], [5, 8], [6, 1], [2, 3], [4, 7], [5, 1], [6, 8], [9, 2], [3, 4], [6, 7], [2, 1], [8, 3], [5, 9], [6, 2], [7, 8], [4, 1], [9, 7], [6, 3], [5, 4], [8, 2], [7, 1], [9, 3], [5, 6], [4, 8], [9, 1], [7, 2], [3, 5]];
const choices = [1, 2];

var finalData = [];

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

		User.find({}, { _id: 0, username: 1, 'question.questionnaire': 1, 'question.Questrack': 1, 'profile.profile_number': 1 }, (err, users) => {

			users.forEach(function (user, i) {
				var finalObj = {
					Username: user.username,
					Profile: user.profile.profile_number,
					Date: user.question.Questrack ? (user.question.Questrack[user.question.Questrack.length - 1] ? user.question.Questrack[user.question.Questrack.length - 1].when : "N/A") : "N/A"
				};
				if (user.question.questionnaire && user.question.questionnaire.length == 36)
					user.question.questionnaire.forEach(function (ques, j) {
						if (choices.indexOf(parseInt(ques)) != -1)
							// console.log(questionnaireMapping[j][parseInt(ques) - 1]);
							finalObj["Q" + (j + 1)] = questionnaireMapping[j][parseInt(ques) - 1];
						else
							// console.log("N/A");
							finalObj["Q" + (j + 1)] = "N/A";
					});
				else
					for (let i = 0; i < 36; i++) {
						finalObj["Q" + (i + 1)] = "N/A";
					}

				finalData.push(finalObj);
			});

			// console.log(finalData);
			var xls = json2xls(finalData);

			fs.writeFileSync('questionnaire_analysis.xlsx', xls, 'binary');

			console.log("Done !!!");
			process.exit(0);
		});
	});

}

xyz();
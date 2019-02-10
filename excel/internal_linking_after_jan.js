'use strict';

//IMPORTING
var mongoose = require('mongoose');
var json2xls = require('json2xls');
var fs = require('fs');

var User = require('../models/user.js');
var config = require('../config.js');

function calculateBsScore(user, key) {
	var toSend = [];
	// var obj = {};
	var ln_id = key.keyword_id;

	user.profile.beliefs
		.filter(function (belief) { return (('linked_ln' in belief) && (belief.linked_ln.indexOf(ln_id) != -1)); })
		.forEach(function (belief) {
			var obj = {};
			obj[key.keyword + '-' + belief.sID] = 'Not Selected';
			if (belief.how_much >= 8)
				obj[key.keyword + '-' + belief.sID] = 'Selected';
			toSend.push(obj)
		});

	user.profile.profile_content
		.filter(function (keyword) { return keyword.keyword_id[5] == 2 })
		.forEach(function (keyword) {
			keyword.mini_descriptions
				.filter(function (mini) { return (('linked_ln' in mini) && (mini.linked_ln.indexOf(ln_id) != -1)); })
				.forEach(function (mini) {
					var obj = {};
					obj[key.keyword + '-' + mini.mini_description_id] = 'Not Selected';
					if (mini.relate == 'relatestrongly')
						obj[key.keyword + '-' + mini.mini_description_id] = 'Selected';
					toSend.push(obj)
				});
		});

	return toSend;
}

function xyz() {
	const profile_number = 9;

	// Mongoose Connection
	mongoose.Promise = global.Promise;
	mongoose.connect(config.development.mongoUrl);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
		// we're connected!
		console.log("Connected correctly to server");

		var jan_start = new Date('2019-01-01');

		User.aggregate([
			{ $match: { 'important_date.registration': { $gte: jan_start }, 'profile.profile_number': profile_number } },
			{ $project: { name: { $concat: ['$firstname', ' ', '$lastname'] }, _id: 0, 'profile.beliefs.sID': 1, 'profile.beliefs.how_much': 1, 'profile.beliefs.linked_ln': 1, 'profile.profile_content': 1 } }
		], function (err, users) {
			console.log(users.length);
			const finalData = [];

			users.forEach(function (user) {
				var tObj = [];
				var temp = {
					Name: user.name
				};

				user.profile.profile_content
					.filter(function (key) { return key.keyword_id[5] == 3; })
					.forEach(function (key) {
						tObj.push(...calculateBsScore(user, key));
					})

				tObj.forEach(function (it) {
					for (var key in it)
						temp[key] = it[key];
				});

				console.log(temp);

				finalData.push(temp);

				console.log('till now:', finalData.length);
				console.log('-------------------------------------------------');
			});


			var xls = json2xls(finalData);
			fs.writeFileSync('internal_linking_analysis_after_jan_profile_' + profile_number + '.xlsx', xls, 'binary');

		});
	});
}

xyz();
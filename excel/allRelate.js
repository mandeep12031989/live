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
	console.log(config.development.mongoUrl);

	// Mongoose Connection
	mongoose.Promise = global.Promise;
	mongoose.connect(config.development.mongoUrl);

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function () {
		// we're connected!
		console.log("Connected correctly to server");

		User.find({ 'profile.profile_number': 1 }, { username: 1, 'profile.profile_content': 1 }, (err, users) => {

			Keyword.find({ keyword_id: { $regex: 'P01' } }, (er, keys) => {

				console.log(keys.length);
				var finalData = [];

				keys.forEach((key) => {
					key.mini_descriptions.forEach((mini) => {

						let obj = {
							mini_description: mini.mini_description_id
						};

						users.forEach((user) => {
							user.profile.profile_content.forEach((keyU) => {
								keyU.mini_descriptions.forEach((miniU) => {

									obj[user.username] = obj[user.username] ? obj[user.username] : '-';

									if (mini.mini_description_id == miniU.mini_description_id) {
										obj[user.username] = miniU.relate ? miniU.relate : 'N/A';
									}

								});
							});
						});
						console.log(obj);
						finalData.push(obj);

						var xls = json2xls(finalData);

						fs.writeFileSync('data.xlsx', xls, 'binary');
						process.exit(0);

					});
				});

				// console.log(finalData);
				var xls = json2xls(finalData);

				fs.writeFileSync('data.xlsx', xls, 'binary');

			});

		});
	});

}

xyz();
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
var config = require('../config.js');

var profile = 9;

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

		User.find({ 'profile.profile_number': profile, $where: "this.profile.beliefs && this.profile.beliefs.length > 0" }, { firstname: 1, lastname: 1, 'profile.beliefs': 1 }).sort('-profile.beliefs.sID')
			.exec((err, users) => {

				var finalData = [];

				users.forEach(function (user, uI) {
					var obj = { name: user.firstname + ' ' + user.lastname };

					user.profile.beliefs.forEach(function (belief, bI) {
						obj[belief.sID] = belief.how_much ? belief.how_much : 'N/A';
					});

					finalData.push(obj);
				});

				console.log("Done !!!");
				// console.log(finalData);
				var xls = json2xls(finalData);

				fs.writeFileSync('belief' + profile + '.xlsx', xls, 'binary');
			});
	});

}

xyz();
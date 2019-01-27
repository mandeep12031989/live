'use strict';

//IMPORTING
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var xlsx = require('xlsx');
var fs = require('fs');

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

		Keyword.find({ keyword_id: /P0(1|[3-9])S03/ }, { 'report_descriptions': 1, keyword_id: 1 }, function (er, keywords) {
			if (er) {
				process.exit(0);
			}
			else {
				var updated_count = 0;

				var pronoun_to_replace = {
					' his': ' _his_',
					' himself': ' _himself_',
					' him': ' _him_',
					' he': ' _he_',
					'His ': '_His_ ',
					'Himself ': '_Himself_ ',
					'Him ': '_Him_ ',
					'He ': '_He_ '
				};

				keywords.forEach(function (keyword) {
					console.log('->', keyword.keyword_id);
					keyword.report_descriptions.forEach(function (mini) {
						console.log('before:', mini.mini_description);
						for (var key in pronoun_to_replace) {
							mini.mini_description = mini.mini_description.replace(new RegExp(key, 'g'), pronoun_to_replace[key]);
						}
						console.log('after:', mini.mini_description);
						console.log('------------------------------');
					});
					console.log('\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n');
					Keyword.update({ keyword_id: keyword.keyword_id }, { $set: { 'report_descriptions': keyword.report_descriptions } }, function () {
						console.log(++updated_count);
					});
				});

			}
		});
	});
}

xyz();
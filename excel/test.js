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

		// var cursor = User.find({}, {}).cursor();

		// const len = [];

		// cursor.on('data', function (doc) {
		// 	len.push(doc);
		// 	console.log('\ntill now:', len.length)
		// 	// Called once for every document
		// });
		// cursor.on('close', function () {
		// 	console.log('DONE')
		// 	// Called when done
		// });

		User.find({}, 'username').limit(5).sort('-username').exec(function (er, res) {
			console.log(res)
		})

	});

}

xyz();
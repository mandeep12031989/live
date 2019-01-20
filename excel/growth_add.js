'use strict';

//IMPORTING
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var xlsx = require('xlsx');
var fs = require('fs');

var GrRec = require('../models/growth_rec_assessor');
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

		var workbook = xlsx.readFile('growthRecUpload.xlsx');

		var rows = xlsx.utils.sheet_to_json(workbook.Sheets['Sheet 1']);

		rows.forEach(function (row) {
			for (var key in row) {
				row[key] = row[key].trim();
			}
		});

		console.log(rows);

		GrRec.insertMany(rows, function (err) {
			console.log(err, "DONE");

			process.exit(0);
		});
	});
}

xyz();
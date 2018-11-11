'use strict';

//IMPORTING
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var xlsx = require('xlsx');
var fs = require('fs');

var Competency = require('../models/competency.js');
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

		var workbook = xlsx.readFile('competency_data.xlsx');
		// workbook.SheetNames.forEach(function (sheetName) {
		// 	// Get headers.
		// 	var headers = [];
		// 	var sheet = workbook.Sheets[sheetName];
		// 	var range = xlsx.utils.decode_range(sheet['!ref']);
		// 	var C, R = range.s.r;
		// 	/* start in the first row */
		// 	/* walk every column in the range */
		// 	for (C = range.s.c; C <= range.e.c; ++C) {
		// 		var cell = sheet[xlsx.utils.encode_cell({ c: C, r: R })];
		// 		/* find the cell in the first row */

		// 		var hdr = "UNKNOWN " + C; // <-- replace with your desired default
		// 		if (cell && cell.t) {
		// 			hdr = xlsx.utils.format_cell(cell);
		// 		}
		// 		headers.push(hdr);
		// 	}
		// 	console.log(headers);
		// 	// For each sheets, convert to json.
		// 	var roa = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
		// 	if (roa.length > 0) {
		// 		roa.forEach(function (row) {
		// 			console.log(row);
		// 			// Set empty cell to ''.
		// 			headers.forEach(function (hd) {
		// 				if (row[hd] == undefined) {
		// 					row[hd] = '';
		// 				}
		// 			});
		// 		});
		// 	}
		// });

		var rows = xlsx.utils.sheet_to_json(workbook.Sheets['Sheet 1'])
		console.log(rows);

		Competency.insertMany(rows, function (err) {
			console.log(err, "DONE");

			process.exit(0);
		});
	});
}

xyz();
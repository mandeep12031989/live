'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recommendSchema = new Schema({
    typeID: {                           //tell you the parent section of a statement
        type: String,
        default: "P__N__"
    },
    title: String,                        //statement name
	statements: [new Schema({sID: {type: String, default: "P__N__S__"}, statement: String})]
});

module.exports = mongoose.model('recommendSchema', recommendSchema);
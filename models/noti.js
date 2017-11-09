'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notiSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    statement: {
        type: String,
        required: true
    },
    who: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('notiSchema', notiSchema);
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var competencySchema = new Schema({
    competency_id: { type: String, default: "C__", trim: true, required: true },
    competency: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    // growth_id: { type: String, default: "P__N__", trim: true },
    domain: { type: String, default: 'NA', uppercase: true, trim: true }
}, { collection: 'competencySchema' });

module.exports = mongoose.model('competencySchema', competencySchema);
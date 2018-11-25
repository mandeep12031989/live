'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roleFitmentSchema = new Schema({
    profile_number: { type: Number, default: 0 },
    suitable_work: [new Schema({
        sID: { type: String, required: true, trim: true },          //S _ _
        statement: { type: String, required: true, trim: true }
    })],
    difficult_work: [new Schema({
        sID: { type: String, required: true, trim: true },          //S _ _
        statement: { type: String, required: true, trim: true }
    })]
}, { collection: 'roleFitmentSchema' });

module.exports = mongoose.model('roleFitmentSchema', roleFitmentSchema);
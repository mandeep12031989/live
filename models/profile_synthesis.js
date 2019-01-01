'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var synthesisSchema = new Schema({
    sID: { type: String, default: "P__N__" },
    statement: { type: String, required: true },
    sub_statement: { type: String, default: '' },
    root_node: { type: Boolean, default: false },
    custom_statement: { type: Boolean, default: true },
    child_nodes: [{ child_node: { type: String, default: '' } }]
}, { collection: 'synthesisSchema' });

module.exports = mongoose.model('synthesisSchema', synthesisSchema);
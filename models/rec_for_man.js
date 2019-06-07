'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recommendSchema = new Schema({
    sID: {                           //tell you the parent section of a statement
        type: String,
        default: "P__N__"
    },
    brief: String,
    statement: String,
    linked_competency: {                           //linked to which competency ?
        type: String,
        default: "C__"
    },
    recommendation_by_assessor: { type: Boolean, default: true },
    linked_keywords: [new Schema({ mini_id: String,
        statements: Array
     })]
});

module.exports = mongoose.model('recommendSchema', recommendSchema);
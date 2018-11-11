'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var growthRecommendSchema = new Schema({
    sID: {                           //tell you the parent section of a statement
        type: String,
        default: "P__N__"
    },
    brief: String,
    statement: String,
    linked_competency: {                           //linked to which keyword ?
        type: String,
        default: "C__"
    }
}, { collection: 'assessorGrowthRecommendSchema' });

module.exports = mongoose.model('assessorGrowthRecommendSchema', growthRecommendSchema);
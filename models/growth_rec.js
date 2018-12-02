'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var growthRecommendSchema = new Schema({
    sID: {                           //tell you the parent section of a statement
        type: String,
        default: "P__N__"
    },
    statement: String,
    linked_keyword: {                           //linked to which keyword ?
        type: String,
        default: "P__S__K__"
    }
});

module.exports = mongoose.model('growthRecommendSchema', growthRecommendSchema);
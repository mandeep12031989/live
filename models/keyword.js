'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var descriptionSchema = new Schema({
    mini_description_id: {                           //tells you the parent keyword and helps to distinguish mini-descriptions
        type: String,
        default: "P__S__K__M__"
    },
    mini_description: String,
    mini_description_h: String,
    tag: {
        personal: {
            type: Boolean,
            default: false
        },
        professional: {
            type: Boolean,
            default: false
        },
        company: {
            type: Boolean,
            default: false
        },
        competency: {
            type: Boolean,
            default: false
        }
    },
    paei_tag: {
        pm: {

        },
        p: {
            c19: { type: Boolean, default: false },
            c20: { type: Boolean, default: false },
            c21: { type: Boolean, default: false },
            c22: { type: Boolean, default: false },
            c23: { type: Boolean, default: false }
        },
        a: {
            c24: { type: Boolean, default: false },
            c25: { type: Boolean, default: false },
            c26: { type: Boolean, default: false },
            c27: { type: Boolean, default: false },
            c28: { type: Boolean, default: false },
            c29: { type: Boolean, default: false },
            c30: { type: Boolean, default: false }
        },
        e: {
            c31: { type: Boolean, default: false },
            c32: { type: Boolean, default: false },
            c33: { type: Boolean, default: false },
            c34: { type: Boolean, default: false },
            c35: { type: Boolean, default: false }
        },
        i: {
            c36: { type: Boolean, default: false },
            c37: { type: Boolean, default: false },
            c38: { type: Boolean, default: false },
            c39: { type: Boolean, default: false },
            c40: { type: Boolean, default: false }
        }
    },
    responsive_statement: String,
    mini_by_assessor: { type: Boolean, default: false },
    relate_percentage: { type: Number, default: 0 },
    linked_ln: { type: Array, default: [] },
    assessor_report_mini_check: { type: Boolean, default: true }
});

var descriptionReportSchema = new Schema({
    mini_description_id: {                           //tells you the parent keyword and helps to distinguish mini-descriptions
        type: String, default: "P__S__K__M__"
    },
    mini_description: String,
    mini_description_h: String
});

var keywordSchema = new Schema({
    section_id: {                           //tell you the parent section of a keyword
        type: String, default: "P__S__"
    },
    keyword_id: {                           //unique ID to distinguish keywords
        type: String, default: "P__S__K__"
    },
    keyword: String,                        //keyword name
    keyword_h: String,                        //keyword name
    mini_descriptions: [descriptionSchema],     //keyword's different meanings/statements or say mini-descriptions
    linked_keyword: {                           //linked to which keyword ?
        type: String, default: "P__S__K__"
    },
    belongs_to: {
        personal: { type: Boolean, default: false },
        professional: { type: Boolean, default: false }
    },
    balancing_description: [new Schema({ desc: String })],
    comment_placeholder: [new Schema({ question: String })],
    dummy_keyword: String,
    key_version: { type: String, default: 'v2.13' },
    new_keyword: { type: Boolean, default: false },
    report_descriptions: [descriptionReportSchema]
}, { usePushEach: true });

module.exports = mongoose.model('keywordSchema', keywordSchema);
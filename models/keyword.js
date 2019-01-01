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
        //old
        // ptag: {
        //     type: Boolean, default: false
        // },
        // atag: {
        //     type: Boolean, default: false
        // },
        // etag: {
        //     type: Boolean, default: false
        // },
        // itag: {
        //     type: Boolean, default: false
        // },
        //new
        pm: {
            c01: { type: Boolean, default: false },
            c02: { type: Boolean, default: false }
        },
        p: {
            c03: { type: Boolean, default: false },
            c04: { type: Boolean, default: false },
            c05: { type: Boolean, default: false }
        },
        a: {
            c06: { type: Boolean, default: false },
            c07: { type: Boolean, default: false },
            c08: { type: Boolean, default: false },
            c09: { type: Boolean, default: false },
            c10: { type: Boolean, default: false },
            c11: { type: Boolean, default: false },
            c12: { type: Boolean, default: false }
        },
        e: {
            c13: { type: Boolean, default: false },
            c14: { type: Boolean, default: false },
            c15: { type: Boolean, default: false }
        },
        i: {
            c16: { type: Boolean, default: false },
            c17: { type: Boolean, default: false },
            c18: { type: Boolean, default: false }
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
    key_version: { type: String, default: 'v1.4' },
    new_keyword: { type: Boolean, default: false },
    report_descriptions: [descriptionReportSchema]
}, { usePushEach: true });

module.exports = mongoose.model('keywordSchema', keywordSchema);
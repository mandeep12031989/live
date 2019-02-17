'use strict';

var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var descriptionSchema = new Schema({
    mini_description_id: {                           //tells you the parent keyword and helps to distinguish mini-descriptions
        type: String, default: "P__S__K__M__"
    },
    mini_description: String,
    mini_description_h: String,
    relate: {
        type: String, default: ""
    },
    tag: {
        personal: {
            type: Boolean, default: false
        },
        professional: {
            type: Boolean, default: false
        },
        company: {
            type: Boolean, default: false
        },
        competency: {
            type: Boolean, default: false
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
    mini_rating: {
        type: Number, default: 0
    },
    assessor_mini_rating: {
        type: Number, default: 0
    },
    assessor_relate: {
        type: String, default: ""
    },
    assessor_report_mini_check: { type: Boolean, default: false },
    mini_by_assessor: { type: Boolean, default: false },
    added_to_assessor_library: { type: Boolean, default: false },
    relate_percentage: { type: Number, default: 0 },
    questions: {
        strength: { type: Array },
        learning: { type: Array, default: ['', '', ''] }
    },
    linked_ln: { type: Array, default: [] },
    assessor_selection: String
});

var descriptionReportSchema = new Schema({
    mini_description_id: {                           //tells you the parent keyword and helps to distinguish mini-descriptions
        type: String, default: "P__S__K__M__"
    },
    mini_description: String,
    mini_description_h: String,
    mini_by_assessor: { type: Boolean, default: false }
});

var profileSchema = new Schema({
    section_id: {                           //tell you the parent section of a keyword
        type: String,
        default: "P__S__"
    },
    keyword_id: {                           //unique ID to distinguish keywords
        type: String,
        default: "P__S__K__"
    },
    keyword: String,                        //keyword name
    keyword_h: String,                        //keyword name
    new_keyword: {
        type: Boolean, default: false
    },
    key_added_to_assessor_library: {
        type: Boolean, default: false
    },
    mini_descriptions: [descriptionSchema],     //keyword's different meanings/statements or say mini-descriptions
    linked_keyword: {                           //linked to which keyword ?
        type: String, default: "P__S__K__"
    },
    belongs_to: {
        personal: {
            type: Boolean,
            default: false
        },
        professional: {
            type: Boolean,
            default: false
        }
    },
    balancing_description: [new Schema({ desc: String })],
    comment_placeholder: [new Schema({ question: String })],
    dummy_keyword: String,
    key_version: String,
    key_rating: { type: Number, default: 0 },
    comment: {                              //comment to specific parent keyword
        type: String, default: ""
    },
    assessor_checkbox: { type: Boolean, default: false },
    assessor_key_rating: { type: Number, default: 0 },
    assessor_comment: {                              //comment to specific parent keyword
        type: String, default: ""
    },
    assessor_bal_in_report: { type: Boolean, default: true },
    assessor_report_keyword: { type: String, default: "" },
    bsl_score: { type: Number, default: 0 },
    report_descriptions: [descriptionReportSchema],
    do_ask_comment: { type: String, default: "" },
    relate_combine_comment: String
});

var userSchema = new Schema({
    OauthId: String,
    OauthToken: String,
    username: {
        type: String, required: true, unique: true, trim: true
    },
    username_verified: {
        type: Boolean, default: false
    },
    password: String,
    password_reset_token: String,
    firstname: {
        type: String, default: "", trim: true
    },
    lastname: {
        type: String, default: "", trim: true
    },
    facilitator_name: {
        type: String, default: "--UNKNOWN--", index: true, trim: true
    },
    are_you: {
        admin: {
            type: Boolean, default: false
        },
        facilitator: {
            type: Boolean, default: false
        },
        manager: {
            type: Boolean, default: false
        }
    },
    important_date: {
        registration: {
            type: Date, default: Date.now
        },
        last_login: {
            type: Date, default: Date.now
        }
    },
    profile: {
        profile_number: { type: Number, default: 0 },
        profile_content: [profileSchema],
        track: [new Schema({ time_taken: Number, attempt: { type: Number, default: 0 }, when: Date })],				// in seconds
        eachSectionTrack: {
            timeBelief: [new Schema({ time_taken: Number, attempt: { type: Number, default: 0 }, when: Date })],
            timeValue: [new Schema({ time_taken: Number, attempt: { type: Number, default: 0 }, when: Date })],
            timeStrength: [new Schema({ time_taken: Number, attempt: { type: Number, default: 0 }, when: Date })],
            timeLearning: [new Schema({ time_taken: Number, attempt: { type: Number, default: 0 }, when: Date })],
            timeGrowth: [new Schema({ time_taken: Number, attempt: { type: Number, default: 0 }, when: Date })]
        },
        old: [new Schema({ pro: [profileSchema], pro_num: Number })],
        growth_recommendations: [new Schema({ sID: String, statement: String, linked_keyword: String, selected: Boolean })],
        growth_recommendations_assessor: [new Schema({ sID: String, brief: String, statement: String, linked_competency: String, selected: { type: Boolean, default: false }, growth_by_assessor: { type: Boolean, default: false }, added_to_assessor_library: { type: Boolean, default: false }, linked_keywords: [new Schema({ mini_id: String })] })],
        old_growth_recommendations: [new Schema({ gr: Array, pro_num: Number })],
        beliefs: [new Schema({
            sID: String, statement: String, how_much: Number, comment: String, linked_ln: { type: Array, default: [] },
            assessor_option: String, assessor_notes: String, assessor_selection: String
        })],
        old_beliefs: [new Schema({ bel: Array, pro_num: Number })],
        eachSectionRelate: Array,
        eachSectionShareMore: Array,
        eachSectionEditable: Array,
        eachSectionStopReflect: Array,
        eachSectionStopReflectDone: Array,
        eachSectionStopReflectPAEI: Array,
        eachSectionStopReflectElse: {
            value: {
                ques2: String
            },
            learning: {
                ques2: String
            }
        },
        StopReflectPAEIDropdown: {
            strength: {
                P: String, A: String, E: String, I: String
            }
        },
        eachSectionCombineComment: {
            assessor_belief_note: String, value: Array, strength: Array, learning: Array
        },
        // eachSectionRelateCombineComment: {
        //     learning: {
        //         ques1: String
        //     }
        // },
        sectionFillDone: {
            strength: { type: Boolean, default: false },
            learning: { type: Boolean, default: false }
        }
    },
    age: Number,
    sex: String,
    work_details: {
        designation: String, experience: String, current_company: String, department: String, role_responsibility: String
    },
    question: {
        RQ1: String, RQ2: String, RQ3: String, RQ4: String,
        RQeditable: Array, questionnaire: Array,
        RQtrack: [new Schema({ time_taken: Number, attempt: { type: Number, default: 0 }, when: Date })],				// in seconds
        Questrack: [new Schema({ time_taken: Number, attempt: { type: Number, default: 0 }, when: Date })],				// in seconds
        RQ_notes: {
            q1: String,
            q2: String,
            q3: String,
            q41: String,
            q42: String,
            q43: String
        }
    },
    last_modification: {
        type: Date, default: ''
    },
    device_details: Object,
    feedback: {
        submitted: {
            type: Boolean, default: false
        },
        q1: String,
        q2: String,
        q2_detailed: String,
        q3: {
            a1: Boolean, a2: Boolean, a3: Boolean, a4: Boolean, a5: Boolean,
            s1: String, s2: String, s3: String, s4: String,
            detailed: String
        },
        q4: String, q5: String, q6: String, q7: String
    },
    peer_reviewers: [new Schema({ name: String, emailid: String, relationship: String, date: Date })],
    peer_reviews: [new Schema({ emailid: String, reviews: [profileSchema], last_modified: Date })],
    assessor: {
        automation_slf_aware: Number, automation_openness: Number, automation_per_mast: Number,
        result: String, position: String, per_mast_lvl: String,
        slf_aware: Number, openness: Number, per_mast: Number,
        specific_competency: [],
        profile_content: [profileSchema],
        description: { type: String, default: '<b>--name--</b>\'s enneagram assessment results are <b>--positive/negative--</b>. <b>--He/She--</b> is at Moderate moving to higher personal mastery levels. <b>--He/She--</b> is enneagram type <b>--type--</b>.' },
        // role_fitment_title: { type: String, default: 'Role Fitment' },
        // role_fitment_description: String,
        // reason_for_change_title: { type: String, default: 'Reason for Change' },
        // reason_for_change_description: String,
        recommend: [new Schema({ title: String, desc: String, page: { type: Number, default: 1 } })],
        rubric: { type: Array, default: [] },
        recommendations_for_manager: [new Schema({ sID: String, brief: String, statement: String, linked_competency: String, selected: { type: Boolean, default: false }, recommendation_by_assessor: { type: Boolean, default: false }, added_to_assessor_library: { type: Boolean, default: false } })],
        role_fitment: {
            suitable_work: [new Schema({
                sID: { type: String, required: true, unique: true, trim: true },          //S _ _
                statement: { type: String, required: true, trim: true },
                selected: { type: Boolean, default: true },
                added_to_assessor_library: { type: Boolean, default: false },
                by_assessor: { type: Boolean, default: false }
            })],
            difficult_work: [new Schema({
                sID: { type: String, required: true, unique: true, trim: true },          //S _ _
                statement: { type: String, required: true, trim: true },
                selected: { type: Boolean, default: true },
                added_to_assessor_library: { type: Boolean, default: false },
                by_assessor: { type: Boolean, default: false }
            })]
        },
        RRAddOns: {
            responsive: [new Schema({ statement: String })],
            moderate: [new Schema({ statement: String })],
            reactive: [new Schema({ statement: String })]
        },
        RRAddOns2: {
            responsive: [new Schema({ statement: String })],
            moderate: [new Schema({ statement: String })],
            reactive: [new Schema({ statement: String })]
        },
        score_competencies: { type: [String], default: ['l', 'l', 'l', 'l'] },
        paei_desc: {
            p: {
                type: Array,
                default: []
            },
            a: {
                type: Array,
                default: []
            },
            e: {
                type: Array,
                default: []
            },
            i: {
                type: Array,
                default: []
            }
        },
        pdf_pages: {
            scores: { type: Boolean, default: true },
            descriptions: { role_fitment: { type: Boolean, default: true }, reason: { type: Boolean, default: true } },
            specific_competency: { type: Boolean, default: true },
            values_strengths: { type: Boolean, default: true },
            learning_need: { type: Boolean, default: true },
            values_role_fitment: { type: Boolean, default: true },
            rec_for_manager: { type: Boolean, default: true },
            pm_m1: { type: Boolean, default: true },
            pm_m2: { type: Boolean, default: true },
            pm_m3: { type: Boolean, default: true },
            paei: { type: Boolean, default: true },
            extras: { type: Boolean, default: true }
        },
        growth_recommendations_assessor_initialized: { type: Boolean, default: false },
        recommendations_for_manager_assessor_initialized: { type: Boolean, default: false },
        first_person_word_count: {
            learning: { type: Number, default: 0 }
        },
        addOnSectionsPDF: {
            scores: [new Schema({ title: String, desc: String })],
            specific_competency: [new Schema({ title: String, desc: String })],
            values_strengths: [new Schema({ title: String, desc: String })],
            learning_need: [new Schema({ title: String, desc: String })],
            values_role_fitment: [new Schema({ title: String, desc: String })],
            paei: [new Schema({ title: String, desc: String })]
        }
    },
    language: {
        type: String,
        default: 'eng'
    },
    teams: Array,
    pdp: {
        leadership_statement: String,
        planTable: [new Schema({
            learning_need: String,
            commitment: String,
            //			timeframe: String,
            //			monitoring: String,
            evaluation: String,
            manager_audit: String,
            manager_review: String
        })],
        weekTable: [new Schema({
            date: Date,
            commitment: String,
            what_worked: String,
            what_didnt: String,
            //			was_being: String
            what_better: String,
            manager_review: String
        })]
    },
    attachments: { type: Array, default: [] },
    rounds_feedback: {
        q1: String,
        q2: String,
        q3: String,
        q4: String
    }
}, { usePushEach: true });

// Methods
/*userSchema.methods.getName = function(){
    return (this.firstname + ' ' + this.lastname);
};*/

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};

// Generating Hash Password and saving
userSchema.pre('save', function (next) {
    var user = this;
    var SALT_FACTOR = 9;

    if (!user.isModified('password'))
        return next();

    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err)
            return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
});

module.exports = mongoose.model('Users', userSchema);
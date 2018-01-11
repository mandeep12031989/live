'use strict';

var bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose = require('passport-local-mongoose');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var descriptionSchema = new Schema({
    mini_description_id: {                           //tells you the parent keyword and helps to distinguish mini-descriptions
        type: String,
        default: "P__S__K__M__"
    },
    mini_description: String,
    relate: {
        type: String,
        default: ""
    },
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
	responsive_statement: String,
    mini_rating: {
        type: Number,
        default: 0
    },
    assessor_mini_rating: {
        type: Number,
        default: 0
    },
    assessor_relate: {
        type: String,
        default: ""
    }
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
	new_keyword: {
		type: Boolean,
		default: false
	},
    mini_descriptions: [descriptionSchema],     //keyword's different meanings/statements or say mini-descriptions
    linked_keyword: {                           //linked to which keyword ?
        type: String,
        default: "P__S__K__"
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
    balancing_description: [new Schema({desc: String})],
    comment_placeholder: [new Schema({question: String})],
	dummy_keyword: String,
    key_version: String,
    key_rating: {
        type: Number,
        default: 0
    },
    comment: {                              //comment to specific parent keyword
        type: String,
        default: ""
    },
	assessor_checkbox: {
		type: Boolean,
		default: false
	},
    assessor_key_rating: {
        type: Number,
        default: 0
    },
    assessor_comment: {                              //comment to specific parent keyword
        type: String,
        default: ""
    },
	assessor_bal_in_report: {
		type: Boolean,
		default: true
	}
});

var userSchema = new Schema({
    OauthId: String,
    OauthToken: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    username_verified: {
        type: Boolean,
        default: false
    },
    password: String,
	password_reset_token: String,
    firstname: {
        type: String,
        default: ""
    },
    lastname: {
        type: String,
        default: ""
    },
    profile_image: {
        type: String,
        default: "./images/avatar/unknown.jpg"
    },
    facilitator_name: {
        type: String,
        default: "--UNKNOWN--"
    },
    are_you: {
        admin: {
            type: Boolean,
            default: false
        },
        facilitator: {
            type: Boolean,
            default: false
        }
    },
    important_date: {
        registration: {
            type: Date,
            default: Date.now
        },
        last_login: {
            type: Date,
            default: Date.now
        }
    },
    profile: {
        profile_number: {
            type: Number,
            default: 0
        },
        profile_content: [profileSchema],
        track: [new Schema({ time_taken: Date })],
        module1: {
            type: Boolean,
            default: false
        },	// not in use
        module2: {
            type: Boolean,
            default: false
        },	// not in use
        module3: {
            type: Boolean,
            default: false
		}// not in use
    },
    //location: String,
    age: Number,
    sex: String,
    work_details: {
        designation: String,
        experience: String,
        current_company: String,
        department: String,
        role_responsibility: String
    },
    question: {
        RQ1: String,
        RQ2: String,
        RQ3: String,
        questionnaire: Array
    },
	last_modification: {
		type: Date,
		default: ''
	},
    device_details: Object,
    feedback: {
        submitted: {
            type: Boolean,
            default: false
        },
		q1: String,
		q2: String,
		q3: {
			a1: String,
			a2: String,
			a3: String,
			a4: String
		},
		q4: String,
		q5: String,
		q6: String,
		q7: String
    },
	peer_reviewers: [new Schema({name: String, emailid: String, relationship: String, date: Date})],
	peer_reviews: [new Schema({emailid: String, reviews: [profileSchema], last_modified: Date})],
	assessor: {
		slf_aware: Number,
		openness: Number,
		per_mast: Number,
		profile_content: [profileSchema],
		description: {
			type: String,
			default: '<name>\'s enneagram assessment results are <positive/negative>. <He/She> is at Moderate moving to higher personal mastery levels. <He/She> is enneagram type <type>.'
		},
		recommend: [new Schema({title: String, desc: String})],
		rubric: {
			type: Array,
			default: []
		},
		recommendations_for_manager: [new Schema({typeID: String, title: String, statements: [new Schema({sID: {type: String, default: "P__N__S__"}, statement: String, selected: {type: Boolean, default: false}})]})]
	}
});

// Methods
/*userSchema.methods.getName = function(){
    return (this.firstname + ' ' + this.lastname);
};*/

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err)
            return cb(err);
        cb(null, isMatch);
    });
};

// Generating Hash Password and saving
userSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 9;

  if (!user.isModified('password'))
      return next();

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      if (err)
        return next(err);

      bcrypt.hash(user.password, salt, null, function(err, hash) {
          if (err)
              return next(err);
          user.password = hash;
          next();
      });
  });
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Users', userSchema);
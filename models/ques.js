var mongoose = require('mongoose')
var Schema = mongoose.Schema

var keySchema = new Schema({    
    keyword: String,
    knum: String,
    key_bool:   {
        type: Boolean,
        default: false
    },
	linking: String
});

var question = new Schema({
    desc: String,
    num: String,     
    keywords: [keySchema]
});

module.exports = mongoose.model('QuesSchema', question);

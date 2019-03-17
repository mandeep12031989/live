var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var dragSchema = new Schema({
    sID: { type: String, required: true, trim: true, uppercase: true },
    keyword: { type: String, required: true, trim: true },
    linked_profiles: { type: [Number], default: [] }
});

module.exports = mongoose.model('rankSchema', dragSchema, 'rankschema');

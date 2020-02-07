let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var shortlist = new Schema({
    name: { type: String, required: true },
    userEmail: { type: String, required: true },
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true },
    category: { type: String, required: true },
    accepted: { type: Boolean, required: true },
    rejected: { type: Boolean, required: true }
});

var Shortlist = mongoose.model('shortlist',shortlist);
module.exports = Shortlist;
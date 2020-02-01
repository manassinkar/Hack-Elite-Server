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
    responsePending: { type: Boolean, required: true }
});

shortlist.pre("save", function(next)
{
    console.log(this);
    this.basicDetails.firstName = this.basicDetails.firstName.charAt(0).toUpperCase()+this.basicDetails.firstName.slice(1).toLowerCase();
    this.basicDetails.lastName = this.basicDetails.lastName.charAt(0).toUpperCase()+this.basicDetails.lastName.slice(1).toLowerCase();
    this.password = bcrypt.hashSync(this.password,10);
    next();
});


var Shortlist = mongoose.model('shortlist',shortlist);
module.exports = Shortlist;
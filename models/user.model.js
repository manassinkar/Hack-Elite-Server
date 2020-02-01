let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;

var resume = new Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    file: { type: Buffer, required: true }
},{ _id : false });

var user = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    resumeFile: { type: resume, required: true},
    category: { type: String, required: true },
    skills: {type: [String], required: true}
});

user.pre("insertOne", function(next)
{
    console.log(this);
    this.basicDetails.firstName = this.basicDetails.firstName.charAt(0).toUpperCase()+this.basicDetails.firstName.slice(1).toLowerCase();
    this.basicDetails.lastName = this.basicDetails.lastName.charAt(0).toUpperCase()+this.basicDetails.lastName.slice(1).toLowerCase();
    this.password = bcrypt.hashSync(this.password,10);
    next();
});

user.pre("save", function(next)
{
    console.log(this);
    this.basicDetails.firstName = this.basicDetails.firstName.charAt(0).toUpperCase()+this.basicDetails.firstName.slice(1).toLowerCase();
    this.basicDetails.lastName = this.basicDetails.lastName.charAt(0).toUpperCase()+this.basicDetails.lastName.slice(1).toLowerCase();
    this.password = bcrypt.hashSync(this.password,10);
    next();
});


var User = mongoose.model('user',user);
module.exports = User;
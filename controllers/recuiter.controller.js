let Recruiter = require('../models/recuiter.model');
let Shortlist = require('../models/shortlist.model');
let User = require('../models/user.model');
var mailer = require('nodemailer');
var data = require('../data.json');
let bcrypt = require('bcryptjs');

exports.register = (req,res) =>
{
    let recruiter = new Recruiter({
        email: req.body.email,
        password: req.body.password,
        companyName: req.body.companyName,
    });
    recruiter.save((err)=>
    {
        if(err)
        {
            res.status(500).send({ message: "Registeration Failed", error:err });
        }
        else
        {
            res.status(200).send({ message: "Registeration Successful" });
        }
    });
};

exports.login = (req,res) =>
{
    if(req.body.email && req.body.password)
    {
        Recruiter.findOne({ email: req.body.email },(err,ans) =>
        {
            if(err)
            {
                res.status(500).send({ message: "Error while fetching Recruiter Information", error: err });
            }
            else
            {
                if(ans)
                {
                    bcrypt.compare(req.body.password,ans.password,(er,success) =>
                    {
                        if(success)
                        {
                            res.status(200).send({ email: ans.email, firstName: ans.firstName, lastName: ans.lastName, category: ans.category });
                        }
                        else
                        {
                            res.status(401).send({ message: "Wrong Password" });
                        }
                    });
                }
                else
                {
                    res.status(404).send({ message: "Recruiter Doesn't Exist, Please Register" });
                }
            }
        });
    }
    else
    {
        res.status(404).send({ message: "Required Data not Received" });
    }
};

exports.viewProfile = (req,res) =>
{
    if(req.body.email)
    {
        Recruiter.findOne({ email: req.body.email },(err,ans) =>
        {
            if(err)
            {
                res.status(500).send({ message: "Error while fetching Recruiter Information", error: err });
            }
            else
            {
                if(ans)
                {
                    res.status(200).send(ans);
                }
                else
                {
                    res.status(404).send({ message: "Recruiter Doesn't Exist, Please Register" });
                }
            }
        });
    }
    else
    {
        res.status(404).send({ message: "Required Data not Received" });
    }
};

function sendMail(receiverMail,companyName,category)
{
    let transporter = mailer.createTransport({
        service: "Gmail",
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        socketTimeout: 5000,
        auth: {
            user: data.email,
            pass: data.password
        }
    });
    var text  = "Congrats!!\nYou are shortlisted by "+companyName+" for a Job Profile of a "+category;
    let mailOptions = {
        from: data.email, // sender address
        to: receiverMail, // list of receivers
        subject: 'Smart Recruiter Shortlist', // Subject line
        text: text, // plain text body
    };
    transporter.sendMail(mailOptions,(err) =>
    {
        if(err)
        {
            return false
        }
        else
        {
            return true
        }
    });
};

exports.shortlisting = (req,res) =>
{
    User.findOne({ email: req.body.userEmail },{ password: 0 },(err,ans) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Error while fetching User Information", error: err });
        }
        else
        {
            if(ans)
            {
                var shortlist = new Shortlist({
                    name: ans.firstName+" "+ans.lastName,
                    userEmail: ans.email,
                    companyName: req.body.companyName,
                    companyEmail: req.body.companyEmail,
                    category: req.body.category,
                    accepted: false,
                    rejected: false
                });
                shortlist.save((er)=>
                {
                    if(er)
                    {
                        res.status(500).send({ message: "Error while shorlisting", error: er });
                    }
                    else
                    {
                        var mailSent = sendMail(shortlist.userEmail,shortlist.companyName,shortlist.category);
                        var message = ''
                        if(mailSent)
                        {
                            message = "Shortlisted and Mail Sent to Candidate";
                        }
                        else
                        {
                            message = "Shortlisted but Failed to Send Mail to Candidate";
                        }
                        res.status(200).send({ message: message });
                    }
                });
            }
            else
            {
                res.status(404).send({ message: "User Doesn't Exist, Please Register" });
            }
        }
    });
};
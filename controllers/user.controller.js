let User = require('../models/user.model');
let fs = require('fs');
let bcrypt = require('bcryptjs');
let pdfParser = require('pdf-parse');
var mailer = require('nodemailer');
var data = require('../data.json');

var { PythonShell } = require('python-shell');

exports.register = (req,res) =>
{
    if(req.body.resume)
    {
        var f = fs.readFileSync(req.body.resume.path);
        // var f = fs.readFileSync('./x.pdf');
        var encode_file = f.toString('base64');
        const myPythonScriptPath = "x.py";
        var pyshell = new PythonShell(myPythonScriptPath);
        pdfParser(f).then((data) =>
        {
            pyshell.send(JSON.stringify({text: data.text}));
            pyshell.on('message',(message) =>
            {
                var data = JSON.parse(message);
                let user = new User({
                    email: req.body.email,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    resume: encode_file,
                    skills: data.skills,
                    category: data.category
                });
                user.save((err)=>
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
            });
            pyshell.end(function (err) {
                if (err){
                    console.log(err);
                };
            });
        });
    }
    else
    {
        res.status(404).send({ message: "Required Data not Received" });
    }
};

exports.login = (req,res) =>
{
    if(req.body.email && req.body.password)
    {
        User.findOne({ email: req.body.email },(err,ans) =>
        {
            if(er)
            {
                res.status(500).send({ message: "Error while fetching User Information", error: er });
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
                    res.status(404).send({ message: "User Doesn't Exist, Please Register" });
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
        User.findOne({ email: req.body.email },(err,ans) =>
        {
            if(er)
            {
                res.status(500).send({ message: "Error while fetching User Information", error: er });
            }
            else
            {
                if(ans)
                {
                    res.status(200).send(ans);
                }
                else
                {
                    res.status(404).send({ message: "User Doesn't Exist, Please Register" });
                }
            }
        });
    }
    else
    {
        res.status(404).send({ message: "Required Data not Received" });
    }
};

exports.testMail = (req,res) =>
{
    console.log("API Called");
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
    var text  = "Congrats!!\nYou are shortlisted by for a Job Profile";
    let mailOptions = {
        from: data.email, // sender address
        to: req.query.mail, // list of receivers
        subject: 'Smart Recruiter Shortlist', // Subject line
        text: text, // plain text body
    };
    transporter.sendMail(mailOptions,(err) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Mail Not Sent",error: err });
        }
        else
        {
            res.status(200).send({ message: "Mail Sent" });
        }
    });
};
var Shortlist = require('../models/shortlist.model');

exports.accept = (req,res) =>
{
    Shortlist.updateOne({ _id: req.body.id },{ accepted: true, rejected: false },(err) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Shortlist Acceptance Failed" });
        }
        else
        {
            res.status(200).send({ message: "Shortlist Accepted" });
        }
    })
};

exports.reject = (req,res) =>
{
    Shortlist.updateOne({ _id: req.body.id },{ accepted: false, rejected: true },(err) =>
    {
        if(err)
        {
            res.status(500).send({ message: "Shortlist Acceptance Failed" });
        }
        else
        {
            res.status(200).send({ message: "Shortlist Accepted" });
        }
    })
};
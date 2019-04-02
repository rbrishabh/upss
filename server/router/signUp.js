var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var randomize = require('randomatic');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');

var signUp = express.Router();

// middleware that is specific to this router
signUp.use(function timeLog (req, res, next) {
    next();
});

signUp.get('/', authenticated, function (req, res) {
    res.render('signUp.hbs');
});

signUp.post('/', function (req, res) {
    var body = _.pick(req.body, ['sn', 'house', 'dob', 'yoj', 'pyear','address','country','city','zip','lno','email','password','name', 'mobile', 'occupation','oaddress','ocountry','ocity','ozip','olno','faname', 'maname', 'maritalStatus', 'remarks', 'web', 'faxno', 'fb']);
    body.superAdmin = false;
    body.mobile = "+91" + body.mobile;
    body.mobile = body.mobile.replace(/\-/g,"");
    if (req.body.password == req.body.cpassword) {
        var newUser = new Users(body);
        newUser.save().then((user) => {
            if (user) {
                user.success = true;
                user.msg = "Sign-Up Complete!";
                res.render('signUp.hbs',user);
            }
        }, (e) => {

            console.log(e)
            var err = e.errmsg;

            if (err.indexOf("email_1") != -1) {
                var user = {};
                user.msg = 'Email-Id already exists';
                user.err = true;
                res.render('signUp.hbs', user);

            } else if (err.indexOf("mobile_1") != -1) {
                var user = {};
                user.msg = 'Mobile already exists';
                user.err = true;
                res.render('signUp.hbs', user);
            }
            else {
                var user = {};
                console.log(e);
                user.msg = 'Something went wrong, please try again.';
                user.err = true;
                res.render('signUp.hbs', user);
            }
        }).catch((e) => {
            var user = {};
            console.log(e);
            user.err = true;
            user.msg = 'Something went wrong, please try again.';
                res.render('signUp.hbs', user);
        });

    } else {
        var user = {};
        user.msg = "Passwords do not match.";
        user.err = true;
        res.render('signUp.hbs', user);
    }
});


module.exports = signUp;



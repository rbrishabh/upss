var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var randomize = require('randomatic');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');

var home = express.Router();

// middleware that is specific to this router
home.use(function timeLog (req, res, next) {
    next();
});

home.get('/', function (req, res) {
    if (req.session && req.session.userId) {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            res.render('home.hbs', user);
        }, (e) => {
            console.log(e);
            res.send(e);
            // res.render('editEvent.hbs', {msg: "fail"});
        }).catch((e) => {
            // console.log(e);
            res.send(e);
            // res.render('editEvent.hbs', {msg: "fail"});
        });
    } else {
        res.render('home.hbs');
    }

});




module.exports = home;

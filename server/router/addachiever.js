var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var randomize = require('randomatic');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');

var addachiever = express.Router();

// middleware that is specific to this router
addachiever.use(function timeLog (req, res, next) {
    next();
});

addachiever.get('/', authenticate, function (req, res) {
    res.render('addachiever.hbs');
});



module.exports = addachiever;

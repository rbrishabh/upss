var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var randomize = require('randomatic');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');

var addmartyr = express.Router();

// middleware that is specific to this router
addmartyr.use(function timeLog (req, res, next) {
    next();
});

addmartyr.get('/', authenticate, function (req, res) {
    res.render('addmartyr.hbs');
});



module.exports = addmartyr;

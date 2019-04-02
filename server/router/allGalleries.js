var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var randomize = require('randomatic');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');

var allGalleries = express.Router();

// middleware that is specific to this router
allGalleries.use(function timeLog (req, res, next) {
    next();
});

allGalleries.get('/', authenticate, function (req, res) {
    res.render('allGalleries.hbs');
});



module.exports = allGalleries;

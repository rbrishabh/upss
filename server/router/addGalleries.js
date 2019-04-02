var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var randomize = require('randomatic');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');

var addGalleries = express.Router();

// middleware that is specific to this router
addGalleries.use(function timeLog (req, res, next) {
    next();
});

addGalleries.get('/', authenticate, function (req, res) {
    res.render('addGalleries.hbs');
});



module.exports = addGalleries;

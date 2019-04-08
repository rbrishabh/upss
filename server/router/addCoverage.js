var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var fs = require('fs');
const multer = require("multer");
var path = require("path");
const {coverage} = require('./../models/coverage');
var {ObjectID} = require('mongodb');
var randomize = require('randomatic');
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');


var addCoverage = express.Router();

// middleware that is specific to this router
addCoverage.use(function timeLog (req, res, next) {
    next();
});

addCoverage.get('/', authenticate, function (req, res) {
    res.render('addCoverage.hbs');
});


const storage = new GridFsStorage({
    url: database,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "images"
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });



addCoverage.post('/',[authenticate,  upload.single("coverageImage"),], (req,res)=> {
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {

        var body = _.pick(req.body, ['coverageNewsHeading', 'coverageDetails','imageName','imageName']);


        body.coverageImage = req.file.filename;
        body.coverageStatus = "Unconfirmed"
        body.coverageCreator = user.email;
        var newEvent = new coverage(body);
        newEvent.save().then((coverage) => {
            if (coverage) {


                res.redirect('/allCoverages');

            }


            // console.log(typeof coverage.coverageImage.data[0]);



        }, (e) => {
            console.log(e);
            res.render('addCoverage.hbs',  {msg:"fail"});

        }).catch((e) => {
            console.log(e);
            res.render('addCoverage.hbs',  {msg:"fail"});
        });


    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });

});





module.exports = addCoverage;

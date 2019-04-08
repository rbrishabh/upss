var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var fs = require('fs');
const multer = require("multer");
var path = require("path");
const {bearer} = require('./../models/bearer');
var {ObjectID} = require('mongodb');
var randomize = require('randomatic');
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');


var addBearer = express.Router();

// middleware that is specific to this router
addBearer.use(function timeLog (req, res, next) {
    next();
});

addBearer.get('/', authenticate, function (req, res) {
    res.render('addBearer.hbs');
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



addBearer.post('/',[authenticate,  upload.single("bearerImage"),], (req,res)=> {
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {

        var body = _.pick(req.body, ['bearerName', 'bearerFromDate','bearerToDate', 'bearerSchoolNo', 'bearerPost', 'bearerBackground', 'imageName']);

        if(req.body.bearerRankAndDec){
            body.bearerRank = req.body.bearerRankAndDec;
        }

        body.bearerImage = req.file.filename;
        body.bearerStatus = "Unconfirmed"
        body.bearerCreator = user.email;
        var newEvent = new bearer(body);
        newEvent.save().then((bearer) => {
            if (bearer) {


                res.redirect('/allBearers');

            }


            // console.log(typeof bearer.bearerImage.data[0]);



        }, (e) => {
            console.log(e);
            res.render('addBearer.hbs',  {msg:"fail"});

        }).catch((e) => {
            console.log(e);
            res.render('addBearer.hbs',  {msg:"fail"});
        });


    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });

});





module.exports = addBearer;

var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var fs = require('fs');
const multer = require("multer");
var path = require("path");
const {homage} = require('./../models/homage');
var {ObjectID} = require('mongodb');
var randomize = require('randomatic');
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');


var addHomage = express.Router();

// middleware that is specific to this router
addHomage.use(function timeLog (req, res, next) {
    next();
});

addHomage.get('/', authenticate, function (req, res) {
    res.render('addHomage.hbs');
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



addHomage.post('/',[authenticate,  upload.single("homageImage"),], (req,res)=> {
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {

                var body = _.pick(req.body, ['homageName', 'homageDate', 'homageSchoolNo', 'homageNotes', 'homageBackground', 'imageName']);


                        body.homageRank = req.body.homageRankAndDec;
                        body.homageImage = req.file.filename;
                        body.homageStatus = "Unconfirmed"
                        body.homageCreator = user.email;
                        var newEvent = new homage(body);
                        newEvent.save().then((homage) => {
                            if (homage) {


                                res.redirect('/allHomage');

                            }


                                // console.log(typeof homage.homageImage.data[0]);



                        }, (e) => {
                            console.log(e);
                            res.render('addHomage.hbs',  {msg:"fail"});

                        }).catch((e) => {
                            console.log(e);
                            res.render('addHomage.hbs',  {msg:"fail"});
                        });


    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });

});





module.exports = addHomage;

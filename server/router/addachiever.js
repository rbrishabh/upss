var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
const {achiever} = require('./../models/achiever');
var randomize = require('randomatic');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const multer = require("multer");
var path = require("path");
var {ObjectID} = require('mongodb')


var addachiever = express.Router();

// middleware that is specific to this router
addachiever.use(function timeLog (req, res, next) {
    next();
});


addachiever.get('/', authenticate, function (req, res) {
    res.render('addachiever.hbs');
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

addachiever.post("/editAchiever", [authenticate,  upload.single("achieverImage"),], function (req, res) {
    // console.log(req.body);
    var user = req.session.userId;
    Users.findById(user).then((user) => {

        var body = _.pick(req.body, ['achieverName', 'achieverDate', 'achieverSchoolNo', 'achieverNotes', 'achieverCitation', 'imageName', 'idOfAchiever']);
        body.achieverDate = req.body.achieverDates;
        body.achieverRank = req.body.achieverRank;
        body.achieverCreator = user.email;
        var obj = new ObjectID(req.body.idOfAchiever);

        if (req.body.imageName == null || req.body.imageName == undefined || req.body.imageName == "" || !req.body.imageName) {


            achiever.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {

                res.redirect('/editAchiever?id='+body.idOfAchiever);
            }, (e) => {
                res.send(e);
            }).catch((e) => {
                res.send(e);
            });
        } else {


            gfs.remove({filename: req.body.idOfAchieverImage, root: 'images'}, (err, gridStore) => {
                if (err) {
                    return res.status(404).json({err: err});
                } else {
                    body.achieverImage = req.file.filename;
                    achiever.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                        res.redirect('/editAchiever?id='+body.idOfAchiever);

                    }, (e) => {
                        res.send(e);
                    }).catch((e) => {
                        res.send(e);
                    });
                }
            });
        }

    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });

});


addachiever.post('/',[authenticate,  upload.single("achieverImage"),], (req,res)=> {
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {

        var body = _.pick(req.body, ['achieverName', 'achieverSchoolNo', 'achieverNotes', 'achieverBackground', 'imageName']);



        body.achieverImage = req.file.filename;
        body.achieverStatus = "Unconfirmed"
        body.achieverCreator = user.email;
        var newEvent = new achiever(body);
        newEvent.save().then((achiever) => {
            if (achiever) {


                res.redirect('/allAchievers');

            }


            // console.log(typeof achiever.achieverImage.data[0]);



        }, (e) => {
            console.log(e);
            res.render('addAchiever.hbs',  {msg:"fail"});

        }).catch((e) => {
            console.log(e);
            res.render('addAchiever.hbs',  {msg:"fail"});
        });


    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });

});



module.exports = addachiever;

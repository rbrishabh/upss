var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
const {martyr} = require('./../models/martyr');
var randomize = require('randomatic');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const multer = require("multer");
var path = require("path");
var {ObjectID} = require('mongodb')


var addmartyr = express.Router();

// middleware that is specific to this router
addmartyr.use(function timeLog (req, res, next) {
    next();
});

addmartyr.get('/', authenticate, function (req, res) {
    res.render('addmartyr.hbs');
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

addmartyr.post("/editMartyr", [authenticate,  upload.single("martyrImage"),], function (req, res) {
    // console.log(req.body);
    var user = req.session.userId;
    Users.findById(user).then((user) => {

        var body = _.pick(req.body, ['martyrName', 'martyrDate', 'martyrSchoolNo', 'martyrNotes', 'martyrCitation', 'imageName', 'idOfMartyr']);
        body.martyrDate = req.body.martyrDates;
        body.martyrRank = req.body.martyrRank;
        body.martyrCreator = user.email;
        var obj = new ObjectID(req.body.idOfMartyr);

        if (req.body.imageName == null || req.body.imageName == undefined || req.body.imageName == "" || !req.body.imageName) {


            martyr.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {

                res.redirect('/editMartyr?id='+body.idOfMartyr);
            }, (e) => {
                res.send(e);
            }).catch((e) => {
                res.send(e);
            });
        } else {


            gfs.remove({filename: req.body.idOfMartyrImage, root: 'images'}, (err, gridStore) => {
                if (err) {
                    return res.status(404).json({err: err});
                } else {
                    body.martyrImage = req.file.filename;
                    martyr.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                        res.redirect('/editMartyr?id='+body.idOfMartyr);

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


addmartyr.post('/',[authenticate,  upload.single("martyrImage"),], (req,res)=> {
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {

        var body = _.pick(req.body, ['martyrName', 'martyrDate', 'martyrSchoolNo', 'martyrNotes', 'martyrCitation', 'imageName']);


        body.martyrRank = req.body.martyrRank;
        body.martyrImage = req.file.filename;
        body.martyrStatus = "Unconfirmed"
        body.martyrCreator = user.email;
        var newEvent = new martyr(body);
        newEvent.save().then((martyr) => {
            if (martyr) {


                res.redirect('/allMartyrs');

            }


            // console.log(typeof martyr.martyrImage.data[0]);



        }, (e) => {
            console.log(e);
            res.render('addMartyr.hbs',  {msg:"fail"});

        }).catch((e) => {
            console.log(e);
            res.render('addMartyr.hbs',  {msg:"fail"});
        });


    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });

});







module.exports = addmartyr;

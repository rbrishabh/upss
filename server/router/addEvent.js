var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var fs = require('fs');
const multer = require("multer");
var path = require("path");
const {events} = require('./../models/events');
var {ObjectID} = require('mongodb');
var randomize = require('randomatic');
const crypto = require("crypto");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');



var addEvent = express.Router();

// middleware that is specific to this router
addEvent.use(function timeLog (req, res, next) {
    next();
});

addEvent.get('/', authenticate, function (req, res) {
    res.render('addEvent.hbs');
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
                    bucketName: "events"
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });







addEvent.post('/',[authenticate,  upload.single("eventImage"),], (req,res)=> {
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {
        var body = _.pick(req.body, ['eventName', 'eventDate', 'eventOrganizer', 'eventNotes', 'eventLocation', 'imageName', 'eventRepeatFreq', 'eventRepeatDate']);
        var img = req.file.filename;
        body.eventImage = img;
        body.eventStatus = "Unconfirmed"
        body.eventCreator = user.email;
                        var newEvent = new events(body);
                        newEvent.save().then((event) => {
                            if (event) {

                                res.redirect('/allEvents');

                            }

                        }, (e) => {
                            console.log(e);
                            res.render('addEvent.hbs',  {msg:"fail"});
                        }, (e) => {
                            console.log(e);
                            res.render('addEvent.hbs',  {msg:"fail"});
                        }).catch((e) => {
                            console.log(e);
                            res.render('addEvent.hbs',  {msg:"fail"});
                        });
  }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });

});




module.exports = addEvent;

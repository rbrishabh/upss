var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var fs = require('fs');
const multer = require("multer");
const {events} = require('./../models/events');
var randomize = require('randomatic');
const formidable = require('formidable');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');

var addEvent = express.Router();

// middleware that is specific to this router
addEvent.use(function timeLog (req, res, next) {
    next();
});

addEvent.get('/', function (req, res) {
    res.render('addEvent.hbs');
});

addEvent.post('/',authenticate, (req,res)=> {
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {
       var form =  new formidable.IncomingForm();
        form.parse(req);
        form.parse(req,(err, fields, files)=>{
            if(err){
                console.log(err);
                res.send(err);
            } else {
                console.log('Fields', fields);
                // console.log('Files', files);
                // files.map(file=>{
                //     console.log(file);
                // })
                var body = _.pick(fields, ['eventName', 'eventDate', 'eventOrganizer', 'eventNotes', 'eventLocation', 'imageName', 'eventRepeatFreq', 'eventRepeatDate']);

                var newEvent = new events(body);
                newEvent.eventImage.data =  fs.readFileSync(files.eventImage.path);
                newEvent.eventImage.contentType = files.eventImage.type;
                newEvent.save().then((event) => {
                    if (event) {
                        events.findOne({eventOrganizer:fields.eventOrganizer}).then((event)=>{
                            res.contentType(event.eventImage.contentType);
                            // console.log(typeof event.eventImage.data[0]);
                            res.send(event.eventImage.data);
                        });
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




            }


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

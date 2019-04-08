
var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var fs = require('fs');
const multer = require("multer");
const {bearer} = require('./../models/bearer');
var {ObjectID} = require('mongodb')
var randomize = require('randomatic');
const formidable = require('formidable');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');
// var {mongoose,db, global} = require('./../db/mongoose');


var allBearers = express.Router();

// middleware that is specific to this router
allBearers.use(function timeLog (req, res, next) {
    next();
});

allBearers.get('/', authenticate, function (req, res) {
    res.render('allBearers.hbs');
});

allBearers.get('/getData', authenticate, function (req, res) {
    // console.log('something happened here');
    // console.log(req.query, "asdas")
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {
        var searchStr = req.query.search.value;
        if(req.query.search.value)
        {
            var regex = new RegExp(req.query.search.value, "i")
            searchStr = {bearerCreator:{ $ne: user.email}, $or: [{'bearerPost':regex },{'bearerName':regex },{'bearerBackground': regex },{'bearerStatus': regex },{'bearerSchoolNo': regex },{'bearerRank': regex },{'bearerFromDate': regex },{'bearerToDate': regex }] };
        }
        else
        {
            searchStr={bearerCreator:{ $ne: user.email}};
        }

        var recordsTotal = 0;
        var recordsFiltered=0;

        bearer.count({bearerCreator:{ $ne: user.email}}, function(err, c) {
            recordsTotal=c;
            // console.log(c);
            bearer.count(searchStr, function(err, c) {
                recordsFiltered=c;
                // console.log(c);
                // console.log(req.query.start);
                // console.log(req.query.length);
                bearer.find(searchStr, 'bearerPost bearerName bearerSchoolNo bearerFromDate bearerToDate bearerBackground bearerRank bearerOptions bearerStatus',{'skip': Number(req.query.start), 'limit': Number(req.query.length) }, function (err, results) {
                    if (err) {
                        console.log('error while getting results'+err);
                        return;
                    }
                    // console.log(results);
                    var data = JSON.stringify({
                        "draw": req.body.draw,
                        "recordsFiltered": recordsFiltered,
                        "recordsTotal": recordsTotal,
                        "data": results
                    });
                    res.send(data);
                });

            });
        });
    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });


});

allBearers.get('/getMyData', authenticate, function (req, res) {
    console.log('something happened here');
    // console.log(req.query, "asdas")
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {
        console.log(user.email);
        var searchStr = req.query.search.value;
        if(req.query.search.value)
        {
            var regex = new RegExp(req.query.search.value, "i")
            searchStr = {bearerCreator : user.email, $or: [{'bearerPost':regex },{'bearerName':regex },{'bearerBackground': regex },{'bearerStatus': regex },{'bearerSchoolNo': regex },{'bearerRank': regex },{'bearerFromDate': regex },{'bearerToDate': regex }] };
        }
        else
        {
            searchStr={bearerCreator : user.email};
        }

        var recordsTotal = 0;
        var recordsFiltered=0;

        bearer.count({bearerCreator:user.email},function(err, c) {
            recordsTotal=c;
            // console.log(c);
            bearer.count(searchStr, function(err, c) {
                recordsFiltered=c;
                // console.log(c);
                // console.log(req.query.start);
                // console.log(req.query.length);
                bearer.find(searchStr, 'bearerPost bearerName bearerSchoolNo bearerFromDate bearerToDate bearerBackground bearerRank bearerOptions bearerStatus',{'skip': Number(req.query.start), 'limit': Number(req.query.length) }, function (err, results) {
                    if (err) {
                        console.log('error while getting results'+err);
                        return;
                    }
                    // console.log(results);
                    var data = JSON.stringify({
                        "draw": req.body.draw,
                        "recordsFiltered": recordsFiltered,
                        "recordsTotal": recordsTotal,
                        "data": results
                    });
                    res.send(data);
                });

            });
        });
    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });

});

allBearers.get('/delete', authenticate, function (req, res) {
    var id = req.query.id;

    var obj = new ObjectID(id);
    var user = req.session.userId;

    Users.findById(user).then((user) => {
        bearer.findById(id).then((found) => {
            if (found.bearerCreator == user.email) {
                bearer.findOneAndDelete({_id: obj}).then((found) => {
                    if (found) {
                        console.log(found);
                        var obj = found.bearerImage;
                        gfs.remove({filename:obj, root: 'images'}, (err, gridStore) => {
                            if (err) {
                                return res.status(404).json({err: err});
                            } else {
                                res.redirect('/allBearers');


                            }
                        });


                    }
                }, (e) => {
                    console.log(e);
                    res.send(e);

                }).catch((e) => {
                    console.log(e);
                    res.send(e);
                });
            } else {
                res.sendStatus(401).send();
            }
        }, (e) => {
            res.send(e);
        }).catch((e) => {
            res.send(e);
        });


    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });
});

// addEvent.post('/',authenticate, (req,res)=> {
//     var user = req.session.userId;
//     var obj = {};
//     Users.findById(user).then((user) => {
//         var form =  new formidable.IncomingForm();
//         form.parse(req);
//         form.parse(req,(err, fields, files)=>{
//             if(err){
//                 console.log(err);
//                 res.send(err);
//             } else {
//                 console.log('Fields', fields);
//                 // console.log('Files', files);
//                 // files.map(file=>{
//                 //     console.log(file);
//                 // })
//                 var body = _.pick(fields, ['eventName', 'eventDate', 'eventOrganizer', 'eventNotes', 'eventLocation', 'imageName', 'eventRepeatFreq', 'eventRepeatDate']);
//
//
//                 const readStream =  fs.createReadStream(files.eventImage.path);
//                 const options = ({ filename: files.eventImage.name, contentType: files.eventImage.type});
//                 attachmentGrid.write(options, readStream, (error, file) => {
//                     if(error){
//                         res.send(error);
//                     } else {
//                         body.imageName = file.filename;
//                         body.eventImage = file._id;
//
//                         var newEvent = new events(body);
//                         newEvent.save().then((event) => {
//                             if (event) {
//                                 console.log(event.eventImage);
//                                 var obj = new ObjectID(event.eventImage);
//                                 console.log(obj);
//                                 attachmentGrid.readById(obj, (error, buffer) => {
//                                     if(error){
//                                         console.log(error);
//                                         res.send(error);
//                                     } else {
//                                         console.log(buffer);
//                                         res.contentType(file.contentType);
//                                         res.send(buffer);
//                                     }
//
//                                 });
//
//                                 // console.log(typeof event.eventImage.data[0]);
//
//
//                             }
//                         }, (e) => {
//                             console.log(e);
//                             res.render('addEvent.hbs',  {msg:"fail"});
//                         }, (e) => {
//                             console.log(e);
//                             res.render('addEvent.hbs',  {msg:"fail"});
//                         }).catch((e) => {
//                             console.log(e);
//                             res.render('addEvent.hbs',  {msg:"fail"});
//                         });
//                     }
//                 });
//
//
//
//
//
//
//             }
//
//
//         });
//
//
//
//     }, (e) => {
//         console.log(e);
//         res.redirect("/login");
//     }).catch((e) => {
//         console.log(e);
//         res.send(e);
//     });
//
// });
//



module.exports = allBearers;

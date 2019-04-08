
var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var fs = require('fs');
const multer = require("multer");
const {coverage} = require('./../models/coverage');
var {ObjectID} = require('mongodb')
var randomize = require('randomatic');
const formidable = require('formidable');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');
// var {mongoose,db, global} = require('./../db/mongoose');


var allCoverage = express.Router();

// middleware that is specific to this router
allCoverage.use(function timeLog (req, res, next) {
    next();
});

allCoverage.get('/', authenticate, function (req, res) {
    res.render('allcoverage.hbs');
});

allCoverage.get('/getData', authenticate, function (req, res) {
    // console.log('something happened here');
    // console.log(req.query, "asdas")
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {
        var searchStr = req.query.search.value;
        if(req.query.search.value)
        {
            var regex = new RegExp(req.query.search.value, "i")
            searchStr = {coverageCreator:{ $ne: user.email}, $or: [{'coverageNewsHeading':regex },{'coverageStatus': regex }] };
        }
        else
        {
            searchStr={coverageCreator:{ $ne: user.email}};
        }

        var recordsTotal = 0;
        var recordsFiltered=0;

        coverage.count({coverageCreator:{ $ne: user.email}}, function(err, c) {
            recordsTotal=c;
            // console.log(c);
            coverage.count(searchStr, function(err, c) {
                recordsFiltered=c;
                // console.log(c);
                // console.log(req.query.start);
                // console.log(req.query.length);
                coverage.find(searchStr, 'coverageNewsHeading coverageOptions coverageStatus',{'skip': Number(req.query.start), 'limit': Number(req.query.length) }, function (err, results) {
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

allCoverage.get('/getMyData', authenticate, function (req, res) {
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
            searchStr = {coverageCreator : user.email, $or: [{'coverageNewsHeading':regex },{'coverageStatus': regex }] };
        }
        else
        {
            searchStr={coverageCreator : user.email};
        }

        var recordsTotal = 0;
        var recordsFiltered=0;

        coverage.count({coverageCreator:user.email},function(err, c) {
            recordsTotal=c;
            // console.log(c);
            coverage.count(searchStr, function(err, c) {
                recordsFiltered=c;
                // console.log(c);
                // console.log(req.query.start);
                // console.log(req.query.length);
                coverage.find(searchStr, 'coverageNewsHeading coverageOptions coverageStatus',{'skip': Number(req.query.start), 'limit': Number(req.query.length) }, function (err, results) {
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

allCoverage.get('/delete', authenticate, function (req, res) {
    var id = req.query.id;

    var obj = new ObjectID(id);
    var user = req.session.userId;

    Users.findById(user).then((user) => {
        coverage.findById(id).then((found) => {
            if (found.coverageCreator == user.email) {
                coverage.findOneAndDelete({_id: obj}).then((found) => {
                    if (found) {
                        console.log(found);
                        var obj = found.coverageImage;
                        gfs.remove({filename:obj, root: 'images'}, (err, gridStore) => {
                            if (err) {
                                return res.status(404).json({err: err});
                            } else {
                                res.redirect('/allCoverages');


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



module.exports = allCoverage;

var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var fs = require('fs');
const multer = require("multer");
const {homage} = require('./../models/homage');
var {ObjectID} = require('mongodb')
var randomize = require('randomatic');
const formidable = require('formidable');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');
// var {mongoose,db, global} = require('./../db/mongoose');


var allHomage = express.Router();

// middleware that is specific to this router
allHomage.use(function timeLog (req, res, next) {
    next();
});

allHomage.get('/', authenticate, function (req, res) {
    res.render('allHomage.hbs');
});

allHomage.get('/getData', authenticate, function (req, res) {
    // console.log('something happened here');
    // console.log(req.query, "asdas")
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {
        var searchStr = req.query.search.value;
        if(req.query.search.value)
        {
            var regex = new RegExp(req.query.search.value, "i")
            searchStr = {homageCreator:{ $ne: user.email}, $or: [{'homageName':regex },{'homageDate': regex},{'homageBackground': regex },{'homageRank': regex },{'homageStatus': regex },{'homageSchoolNo': regex }] };
        }
        else
        {
            searchStr={homageCreator:{ $ne: user.email}};
        }

        var recordsTotal = 0;
        var recordsFiltered=0;

        homage.count({homageCreator:{ $ne: user.email}}, function(err, c) {
            recordsTotal=c;
            // console.log(c);
            homage.count(searchStr, function(err, c) {
                recordsFiltered=c;
                // console.log(c);
                // console.log(req.query.start);
                // console.log(req.query.length);
                homage.find(searchStr, 'homageName homageSchoolNo homageDate homageBackground homageRank homageOptions homageStatus',{'skip': Number(req.query.start), 'limit': Number(req.query.length) }, function (err, results) {
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

allHomage.get('/getMyData', authenticate, function (req, res) {
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
            searchStr = {homageCreator : user.email, $or: [{'homageName':regex },{'homageDate': regex},{'homageBackground': regex },{'homageRank': regex },{'homageStatus': regex },{'homageSchoolNo': regex }] };
        }
        else
        {
            searchStr={homageCreator : user.email};
        }

        var recordsTotal = 0;
        var recordsFiltered=0;

        homage.count({homageCreator:user.email},function(err, c) {
            recordsTotal=c;
            // console.log(c);
            homage.count(searchStr, function(err, c) {
                recordsFiltered=c;
                // console.log(c);
                // console.log(req.query.start);
                // console.log(req.query.length);
                homage.find(searchStr, 'homageName homageSchoolNo homageDate homageBackground homageRank homageOptions homageStatus',{'skip': Number(req.query.start), 'limit': Number(req.query.length) }, function (err, results) {
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



allHomage.get('/delete', authenticate, function (req, res) {
    var id = req.query.id;

    var obj = new ObjectID(id);
    var user = req.session.userId;

    Users.findById(user).then((user) => {
        homage.findById(id).then((found) => {
            if (found.homageCreator == user.email) {
                homage.findOneAndDelete({_id: obj}).then((found) => {
                    if (found) {
                        console.log(found);
                        var obj = found.homageImage;
                        gfs.remove({filename:obj, root: 'images'}, (err, gridStore) => {
                            if (err) {
                                return res.status(404).json({err: err});
                            } else {
                                res.redirect('/allHomage');


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



module.exports = allHomage;

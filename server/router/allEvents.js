var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var fs = require('fs');
const multer = require("multer");
const {events} = require('./../models/events');
var {ObjectID} = require('mongodb')
var randomize = require('randomatic');
const hbs = require('hbs');

const formidable = require('formidable');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');
// var {mongoose,db, global} = require('./../db/mongoose');


var allEvents = express.Router();

// middleware that is specific to this router
allEvents.use(function timeLog (req, res, next) {
    next();
});

hbs.registerHelper('allEventsTable', function(data) {
    var str = ' <div class="table-responsive">\n' +
        '                                            <table class="table table-bordered table-striped table-hover " style="background-color: #ececec;">\n' +
        '                                                <thead>\n' +
        '<!--\n' +
        '                                                    \n' +
        '-->\n' +
        '                                                       <tr>\n' +
        '                                                        <th> Event Name</th>\n' +
        '                                                        <th> Date</th>\n' +
        '                                                        <th> Organizer</th>\n' +
        '                                                        <th> Repeat</th>\n' +
        '                                                        <th> Location</th>\n' +
        '                                                        <th> Options</th>\n' +
        '                                                        <th> Status</th>\n' +
        '                                                    </tr>\n' +
        '                                                </thead>\n' +
        '\n' +
        '                                        \n' +
        '<tbody>\n';

    for (var i = 0; i < data.length; i++ ) {
        str += '<tr>';
        str += '<td>' + data[i].eventName + '</td>';
        str += '<td>' + data[i].eventDate + '</td>';
        str += '<td>' + data[i].eventOrganizer + '</td>';
        str += '<td>' + data[i].eventRepeatFreq + '</td>';
        str += '<td>' + data[i].eventLocation + '</td>';
        str += '<td> <a href="/viewEvent?id='+data[i]._id+'" class=""  data-toggle="tooltip" data-placement="top" title="View" ><i class="glyphicon glyphicon-eye-open" ></i></a>\n' +
            '                                                            &nbsp; &nbsp; &nbsp;\n' +
            '                                                            <a href="/editEvent?id='+data[i]._id+'" class=""  data-toggle="tooltip" data-placement="top" title="Edit" ><i class="fa fa-pencil" ></i></a>\n' +
            '                                                            &nbsp; &nbsp; &nbsp;\n' +
            '                                                            <a href="/allevents/delete?id='+data[i]._id+'" class=""  data-toggle="tooltip" data-placement="top" title="Delete" ><i class="fa fa-trash" ></i></a></td>';
        str += '<td>' + 'Confirmed' + '</td>';
        // for (var key in data[i]) {
        //     if(typeof data[i][key]=="string")
        // {
        //     console.log(data[i][key]);
        //     str += '<td>' + data[i][key] + '</td>';
        // }
        // };
        str += '</tr>';
    };
    str += '</tbody>' +
        '        \'                                            </table>' +
        '        \'                                        </div>';

    return new hbs.SafeString (str);
});


allEvents.get('/', function (req, res) {
    events.find({}).then((eventss)=>{
        // console.log(eventss);
        var eventsss = [];
        eventsss = eventss;
        var obj = {};
        obj.e = eventsss;
        // console.log(obj);
        res.render('allEvents.hbs', obj);
    },(e)=>{
        res.send(e);
    }).catch((e)=>{
        res.send(e);
    });


});

allEvents.get('/delete', function (req, res) {
   var id = req.query.id;
    var obj = new ObjectID(id);
    events.findOneAndDelete({_id:obj}).then((found)=>{
       if(found){
           console.log(found);
           var obj = new ObjectID(found.eventImage);
           attachmentGrid.unlinkById(obj, (error) => {
               //done!
               res.redirect('/allEvents');
           });


       }
   },(e)=>{
       res.send(e);
    }).catch((e)=>{
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



module.exports = allEvents;

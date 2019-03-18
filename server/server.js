var express = require("express");
var helmet = require("helmet");
const randomize = require("randomatic");
const moment = require('moment');
const hbs = require('hbs');
const _ = require('lodash');
const session = require('express-session')
var {ObjectID} = require('mongodb')
var MongoStore = require('connect-mongo')(session)
const request = require('request');
var fs = require('fs');

const bodyParser = require('body-parser');
var morgan = require("morgan");
var compression = require("compression");
const formidable = require('formidable');


//models and db
const {Users} = require('./models/users');
const {authenticate, authenticated} = require('./middleware/authenticate');
var {mongoose, db} = require('./db/mongoose');
const {events} = require('./models/events');


//router
var signUp = require('./router/signUp');
var login = require('./router/login');
var allHomage = require('./router/allHomage');
var allMartyrs = require('./router/allMartyrs');
var addMartyrs = require('./router/addMartyrs');
var addHomage = require('./router/addHomage');
var allbearers = require('./router/allbearers');
var addAchievers = require('./router/addAchievers');
var allAchievers = require('./router/allAchievers');
var addEvent = require('./router/addEvent');
var allEvents = require('./router/allEvents');
var allcoverage = require('./router/allcoverage');
var donate = require('./router/donate');
var home = require('./router/home');


var app = express();
var toHttps = require('express-to-https').basic;
// app.use(toHttps);

const port = process.env.PORT || 80;

app.set('view engine', 'hbs');
app.use(express.static(__dirname + './../views'));


app.use(bodyParser.urlencoded({extended: false}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use(morgan("common"));
app.use(helmet());
var date = moment();
console.log(date.unix());

app.use('/signUp', signUp);
app.use('/', home);
app.use('/addEvent', addEvent);
app.use('/allEvents', allEvents);
app.use('/addMartyrs', addMartyrs);
app.use('/allbearers', allbearers);
app.use('/allcoverage', allcoverage);
app.use('/donate', donate);
app.use('/allMartyrs', allMartyrs);
app.use('/allHomage', allHomage);
app.use('/allAchievers', allAchievers);
app.use('/addAchievers', addAchievers);
app.use('/addHomage', addHomage);
app.use('/login', login);

app.get("/viewEvent", function (req, res) {
    var id = req.query.id;
    events.findById(id).then((found) => {
        res.render('viewEvent.hbs', found);
    }, (e) => {
        res.send(e);
    }).catch((e) => {
        res.send(e);
    });
});

app.get("/editEvent", function (req, res) {
    var id = req.query.id;
    events.findById(id).then((found) => {
        res.render('editEvent.hbs', found);
    }, (e) => {
        res.send(e);
    }).catch((e) => {
        res.send(e);
    });
});

app.post("/editEvent", authenticate, function (req, res) {
    // console.log(req.body);
    var user = req.session.userId;
    Users.findById(user).then((user) => {
        var form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            console.log("here !!")

            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log('Fields', fields);
                // console.log('Files', files);
                // files.map(file=>{
                //     console.log(file);
                // })
                var body = _.pick(fields, ['eventName', 'eventDate', 'eventOrganizer', 'eventNotes', 'eventLocation', 'imageName', 'eventRepeatFreq', 'eventRepeatDate', 'idOfEvent']);
                body.eventDate = fields.eventDates;
                console.log(body);
                var obj = new ObjectID(fields.idOfEvent);

                if (fields.imageName == null || fields.imageName == undefined || fields.imageName == "" || !fields.imageName) {


                    events.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                        res.render('editEvent.hbs', updated);
                    }, (e) => {
                        res.send(e);
                    }).catch((e) => {
                        res.send(e);
                    });
                } else {
                    console.log('here!!!!!')


                    console.log(fields.idOfEventImage);
                    var obj = new ObjectID(fields.idOfEventImage);
                    attachmentGrid.unlinkById(obj, (error) => {
                        //done!
                        console.log('older image deleted!')
                        var obj = new ObjectID(fields.idOfEvent);
                        events.findOneAndDelete({_id: obj}).then((found) => {
                            if (found) {
                                console.log('older Event deleted!, now new event')
                                console.log(files)
                                //done!
                                const readStream = fs.createReadStream(files.eventImage.path);
                                const options = ({filename: files.eventImage.name, contentType: files.eventImage.type});
                                attachmentGrid.write(options, readStream, (error, file) => {
                                    if (error) {
                                        res.send(error);
                                    } else {
                                        body.imageName = file.filename;
                                        body.eventImage = file._id;

                                        var newEvent = new events(body);
                                        newEvent.save().then((event) => {
                                            if (event) {
                                                console.log(event.eventImage);
                                                var obj = new ObjectID(event.eventImage);
                                                console.log(obj);
                                                attachmentGrid.readById(obj, (error, buffer) => {
                                                    if (error) {
                                                        console.log(error);
                                                        res.send(error);
                                                    } else {
                                                        console.log(buffer);
                                                        res.render('editEvent.hbs', event);
                                                    }

                                                });

                                                // console.log(typeof event.eventImage.data[0]);


                                            }
                                        }, (e) => {
                                            console.log(e);
                                            res.send(e);
                                            // res.render('editEvent.hbs', {msg: "fail"});
                                        }, (e) => {
                                            console.log(e);
                                            res.send(e);
                                            // res.render('editEvent.hbs', {msg: "fail"});
                                        }).catch((e) => {
                                            // console.log(e);
                                            res.send(e);
                                            // res.render('editEvent.hbs', {msg: "fail"});
                                        });
                                    }
                                });

                            }
                        });


                    });
                }

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

app.get("/getImage", function (req, res) {
    var id = req.query.imageId;
    var obj = new ObjectID(id);

    attachmentGrid.readById(obj, (error, buffer) => {
        if (error) {
            console.log(error);
            res.send(error);
        } else {
            console.log(obj)
            console.log(buffer);
            res.contentType('image/jpeg');
            res.send(buffer);
        }
    });
});


app.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }

        });
    } else res.redirect('/');
});


app.use(compression());


app.listen(port, function () {
    console.log(`Server started on PORT ${port}.`);
});
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
var $ = require("jquery");
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
// var addMartyrs = require('./router/addMartyrs');
var addHomage = require('./router/addHomage');
var allbearers = require('./router/allbearers');
// var addAchievers = require('./router/addAchievers');
var allAchievers = require('./router/allAchievers');
var addEvent = require('./router/addEvent');
var allEvents = require('./router/allEvents');
var allCoverage = require('./router/allCoverage');
var donate = require('./router/donate');
var addGalleries = require('./router/addGalleries');
var addmartyr = require('./router/addmartyr');
var addachiever = require('./router/addachiever');
var allGalleries = require('./router/allGalleries');
var home = require('./router/home');


var app = express();
var toHttps = require('express-to-https').basic;
app.use(toHttps);

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

hbs.registerHelper('each_upto', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i)
        result.push(options.fn(ary[i]));
    return result.join('');
});

// hbs.registerHelper('times', function(n, comments, block) {
//     console.log(block.fn[0])
//     var accum = '';
//     console.log(comments);
//     if(comments>2){
//         for(var i = 0; i < n; i++){
//             console.log('here')
//             accum += block.fn(i);
//         }
//         return accum;
//     } else {
//         for(var i = 0; i < comments.length; ++i){
//             accum += block.fn(i);
//         }
//         return accum;
//     }
//
// });

app.use('/signUp', signUp);
app.use('/addachiever', addachiever);
app.use('/addmartyr', addmartyr);
app.use('/', home);
app.use('/addEvent', addEvent);
app.use('/allEvents', allEvents);
// app.use('/addMartyrs', addMartyrs);
app.use('/allbearers', allbearers);
app.use('/addGalleries', addGalleries);
app.use('/allGalleries', allGalleries);
app.use('/allCoverage', allCoverage);
app.use('/donate', donate);
app.use('/allMartyrs', allMartyrs);
app.use('/allHomage', allHomage);
app.use('/allAchievers', allAchievers);
// app.use('/addAchievers', addAchievers);
app.use('/addHomage', addHomage);
app.use('/login', login);

app.get("/viewEvent", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;


    Users.findById(user).then((user) => {
        console.log(typeof user._id);
    events.findById(id).then((post) => {
        if(req.query.showAllComments){
            post.showAtOnce = post.comments.length;
        } else {
            post.showAtOnce = 5;
        }
        if(post.comments.length>0){
            var a = 0;
            for(var i = 0; i < post.comments.length; i++){

                if (
                    post.comments[i].likes.filter(like => like.user.toString() === user._id.toString())
                        .length > 0
                ) {
                    post.comments[i].already = true;
                } else {
                    post.comments[i].already = false;
                }

                var uid = user._id;
                if(post.comments[i].user.equals(uid)){
                    post.comments[i].author = true;
                } else  {
                    post.comments[i].author = false;
                }

                for(var j = 0; j < post.comments[i].commentReplies.length; j++){

                    if(post.comments[i].commentReplies[j].user.equals(uid)) {
                        post.comments[i].commentReplies[j].author = true;
                    } else {
                        post.comments[i].commentReplies[j].author = false;
                    }

                    if (
                        post.comments[i].commentReplies[j].likes.filter(like => like.user.toString() === user._id.toString())
                            .length > 0
                    ) {
                        post.comments[i].commentReplies[j].already = true;
                    } else {
                        post.comments[i].commentReplies[j].already = false;
                    }



                }

                if(i == post.comments.length-1){
                    console.log(i);
                    console.log(post.comments.length-1);
                    if(post.eventCreator == user.email){
                        post.canEdit = true;
                        res.render('viewEvent.hbs', post);
                    } else {
                        res.render('viewEvent.hbs', post);
                    }
                }

            }
        } else {
            if(post.eventCreator == user.email){
                post.canEdit = true;
                res.render('viewEvent.hbs', post);
            } else {
                res.render('viewEvent.hbs', post);
            }
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

app.post('/comment/:id', authenticate, function (req, res) {
        var id = req.params.id;
        var user = req.session.userId;

        Users.findById(user).then((user) => {
            events.findById(id).then((found) => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id
                };
                found.comments.unshift(newComment);
                found.save().then(post => res.json(post));

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

app.get("/editEvent", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;
    Users.findById(user).then((user) => {
        events.findById(id).then((found) => {
            if(found.eventCreator == user.email){
                res.render('editEvent.hbs', found);
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
                body.eventCreator = user.email;
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
                                console.log(found, "earlyy");
                                console.log(files)
                                //done!
                                var founds = {};
                                founds.eventCreator = user.email;
                                founds.eventName = fields.eventName;
                                founds.eventOrganizer = fields.eventOrganizer;
                                founds.eventNotes = fields.eventNotes;
                                founds.eventLocation = fields.eventLocation;
                                founds.imageName = fields.imageName;
                                founds.eventRepeatFreq = fields.eventRepeatFreq;
                                founds.eventRepeatDate = fields.eventRepeatDate;
                                founds.idOfEvent = fields.idOfEvent;
                                founds.eventStatus = fields.eventStatus;
                                founds.comments = found.comments;
                                founds.eventDate = fields.eventDates;
                                console.log(founds, "earl");

                                const readStream = fs.createReadStream(files.eventImage.path);
                                const options = ({filename: files.eventImage.name, contentType: files.eventImage.type});
                                attachmentGrid.write(options, readStream, (error, file) => {
                                    if (error) {
                                        res.send(error);
                                    } else {
                                        founds.imageName = file.filename;
                                        founds.eventImage = file._id;

                                        var newEvent = new events(founds);
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

app.post(
    '/eventComment',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
        console.log(req.query, req.body)
        events.findById(req.query.id)
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: user.name,
                    user:  new ObjectID(user._id),
                    email:user.email,
                    commentId: new ObjectID()
                };

                // Add to comments array
                post.comments.unshift(newComment);

                // Save
                post.save().then(post => res.redirect('/viewEvent?id='+req.query.id));
            })
            .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        }, (e) => {
            console.log(e);
            res.redirect("/login");
        }).catch((e) => {
            console.log(e);
            res.send(e);
        });
    }
);

app.post(
    '/editComment',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            events.findById(req.query.id)
                .then(post => {
                    console.log(post);
                    var commentId = req.query.commentId;


                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    post.comments[foundIndex].text = req.body.editedComment;
                    // Save
                    post.save().then(post => res.redirect('/viewEvent?id='+req.query.id));
                }, (e)=>{
                    console.log(e);
                })
                .catch((err) =>{
                    console.log(err);
                    res.status(404).json({ postnotfound: 'No post found'
                    }) });
        }, (e) => {
            console.log(e);
            res.redirect("/login");
        }).catch((e) => {
            console.log(e);
            res.send(e);
        });
    }
);


app.post(
    '/editCommentReply',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            events.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    var replyId = req.query.replyId;

                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    console.log(foundIndex);
                    var anotherIndex = post.comments[foundIndex].commentReplies.findIndex(comment=> comment.replyId.toString() === replyId.toString());
                    post.comments[foundIndex].commentReplies[anotherIndex].text = req.body.editedReply;
                    // Save
                    post.save().then(post => res.redirect('/viewEvent?id='+req.query.id));
                },(e)=>{
                    console.log(e);
                })
                .catch((err) =>{
                    console.log(err);
                    res.status(404).json({ postnotfound: 'No post found'
                    }) });
        }, (e) => {
            console.log(e);
            res.redirect("/login");
        }).catch((e) => {
            console.log(e);
            res.send(e);
        });
    }
);

app.get(
    '/eventCommentDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            events.findById(req.query.id)
                .then(post => {
                   var commentId = req.query.commentId;
                    post.comments = post.comments.filter( comment=> comment.commentId.toString() !== commentId.toString());
                    post.save().then(post => res.redirect('/viewEvent?id='+req.query.id));
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        }, (e) => {
            console.log(e);
            res.redirect("/login");
        }).catch((e) => {
            console.log(e);
            res.send(e);
        });
    }
);

app.post(
    '/eventCommentReply',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            events.findById(req.query.id)
                .then(post => {
                    console.log(post.comments[0])

                    for(var i = 0; i < post.comments.length; i++){
                        var cid = new ObjectID(req.query.commentId)
                        if(post.comments[i].commentId.equals(cid)){
                            const newComment = {
                                text: req.body.reply,
                                name: user.name,
                                user: new ObjectID(user._id),
                                email:user.email,
                                replyId: new ObjectID()
                            };
                            post.comments[i].commentReplies.unshift(newComment);
                            post.save().then(post => res.redirect('/viewEvent?id='+req.query.id));

                        }
                    }


                    // Add to comments array


                    // Save
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        }, (e) => {
            console.log(e);
            res.redirect("/login");
        }).catch((e) => {
            console.log(e);
            res.send(e);
        });
    }
);

app.get(
    '/eventCommentReplyDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            events.findById(req.query.id)
                .then(post => {
                    console.log(post.comments[0])

                    for(var i = 0; i < post.comments.length; i++){
                        var cid = new ObjectID(req.query.commentId)
                        if(post.comments[i].commentId.equals(cid)){
                            var replyId = req.query.replyId;
                            post.comments[i].commentReplies = post.comments[i].commentReplies.filter( reply=> reply.replyId.toString() !== replyId.toString());
                            post.save().then(post => res.redirect('/viewEvent?id='+req.query.id));

                        }
                    }


                    // Add to comments array


                    // Save
                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        }, (e) => {
            console.log(e);
            res.redirect("/login");
        }).catch((e) => {
            console.log(e);
            res.send(e);
        });
    }
);

app.post(
    '/eventCommentLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            events.findById(req.query.id)
                .then(post => {
                    for(var i = 0; i < post.comments.length; i++){
                        var cid = new ObjectID(req.query.commentId)
                        if(post.comments[i].commentId.equals(cid)){

                            if (
                                post.comments[i].likes.filter(like => like.user.toString() === user._id.toString())
                                    .length > 0
                            ) {
                                post.comments[i].likes = post.comments[i].likes.filter( like => like.user.toString() !== user._id.toString() );
                                post.save().then(()=>{
                                    res.send('false');
                                });
                            } else {
                                post.comments[i].likes.unshift({ user: new ObjectID(user._id), email: user.email, name: user.name});
                                post.save().then(()=>{
                                    res.send('true');
                                });
                            }


                        }
                    }


                    // Add user id to likes array



                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        }, (e) => {
            console.log(e);
            res.redirect("/login");
        }).catch((e) => {
            console.log(e);
            res.send(e);
        });
    }
);


app.post(
    '/eventCommentReplyLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            events.findById(req.query.id)
                .then(post => {
                    for(var i = 0; i < post.comments.length; i++){
                        var cid = new ObjectID(req.query.commentId)
                        if(post.comments[i].commentId.equals(cid)){
                            for(var j = 0; j < post.comments[i].commentReplies.length; j++){
                                var rid = new ObjectID(req.query.replyId);
                                if(post.comments[i].commentReplies[j].replyId.equals(rid)){
                                    if (
                                        post.comments[i].commentReplies[j].likes.filter(like => like.user.toString() === user._id.toString())
                                            .length > 0
                                    ) {
                                        post.comments[i].commentReplies[j].likes = post.comments[i].commentReplies[j].likes.filter( like => like.user.toString() !== user._id.toString() );
                                        post.save().then(()=>{
                                            res.send('false');
                                        });
                                    } else {
                                        post.comments[i].commentReplies[j].likes.unshift({ user: new ObjectID(user._id), email: user.email, name: user.name});
                                        post.save().then(()=>{
                                            res.send('true');
                                        });
                                    }
                                }


                            }
                        }
                    }


                    // Add user id to likes array



                })
                .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
        }, (e) => {
            console.log(e);
            res.redirect("/login");
        }).catch((e) => {
            console.log(e);
            res.send(e);
        });
    }
);

app.use(compression());


app.listen(port, function () {
    console.log(`Server started on PORT ${port}.`);
});
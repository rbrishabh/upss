//Author -- Rishabh Budhiraja -- github.com/rbrishabh

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
var path = require("path");
const RateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
var morgan = require("morgan");
var compression = require("compression");
const crypto = require('crypto');
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
// yp u

//models and db
const {Users} = require('./models/users');
const {authenticate, authenticated} = require('./middleware/authenticate');
var {mongoose, conn} = require('./db/mongoose');
const {events} = require('./models/events');
const {homage} = require('./models/homage');
const {martyr} = require('./models/martyr');
const {coverage} = require('./models/coverage');
const {achiever} = require('./models/achiever');
const {bearer} = require('./models/bearer');


//router
var signUp = require('./router/signUp');
var login = require('./router/login');
var allHomage = require('./router/allHomage');
var allMartyrs = require('./router/allMartyrs');
var addCoverage = require('./router/addCoverage');
// var addMartyrs = require('./router/addMartyrs');
var addHomage = require('./router/addHomage');
var allBearers = require('./router/allbearers');
var addBearer = require('./router/addBearer');
// var addAchievers = require('./router/addAchievers');
var allAchievers = require('./router/allAchievers');
var addEvent = require('./router/addEvent');
var allEvents = require('./router/allEvents');
var allCoverage = require('./router/allCoverage');
var donate = require('./router/donate');
var addGalleries = require('./router/addGalleries');
var addmartyr = require('./router/addmartyr');
var allBirthdays = require('./router/allBirthdays');
var addachiever = require('./router/addachiever');
var allGalleries = require('./router/allGalleries');
var home = require('./router/home');
var profile = require('./router/profile');


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
        mongooseConnection: conn,
        ttl: 1 * 24 * 60 * 60
    })
}));

app.use(morgan("common"));
app.use(helmet());

const limiter = new RateLimit({
    windowMs: 1*60*1000*15, //1 mins
    max:7, // limit of number of req per ip
});

app.use(limiter);

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
app.use('/addofficebearer', addBearer);
app.use('/allEvents', allEvents);
// app.use('/addMartyrs', addMartyrs);
app.use('/allbearers', allBearers);
app.use('/addGalleries', addGalleries);
app.use('/allGalleries', allGalleries);
app.use('/addCoverage', addCoverage);
app.use('/allCoverages', allCoverage);
app.use('/allCoverage', allCoverage);
app.use('/editProfile', profile);
app.use('/allBirthdays', allBirthdays);
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

app.get("/viewHomage", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;


    Users.findById(user).then((user) => {
        console.log(typeof user._id);
        homage.findById(id).then((post) => {
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
                        if(post.homageCreator == user.email){
                            post.canEdit = true;
                            console.log(post);
                            res.render('viewHomage.hbs', post);
                        } else {
                            res.render('viewHomage.hbs', post);
                        }
                    }

                }
            } else {
                if(post.homageCreator == user.email){
                    post.canEdit = true;
                    res.render('viewHomage.hbs', post);
                } else {
                    res.render('viewHomage.hbs', post);
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

app.get("/viewBirthday", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;


    Users.findById(user).then((user) => {
        console.log(typeof user._id);
        Users.findById(id).then((post) => {
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
                        if(post.birthdayCreator == user.email){
                            post.canEdit = true;
                            console.log(post);
                            res.render('viewBirthday.hbs', post);
                        } else {
                            res.render('viewBirthday.hbs', post);
                        }
                    }

                }
            } else {
                if(post.birthdayCreator == user.email){
                    post.canEdit = true;
                    res.render('viewBirthday.hbs', post);
                } else {
                    res.render('viewBirthday.hbs', post);
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
app.get("/viewCoverage", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;


    Users.findById(user).then((user) => {
        console.log(typeof user._id);
        coverage.findById(id).then((post) => {
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
                        if(post.coverageCreator == user.email){
                            post.canEdit = true;
                            console.log(post);
                            res.render('viewCoverage.hbs', post);
                        } else {
                            res.render('viewCoverage.hbs', post);
                        }
                    }

                }
            } else {
                if(post.coverageCreator == user.email){
                    post.canEdit = true;
                    res.render('viewCoverage.hbs', post);
                } else {
                    res.render('viewCoverage.hbs', post);
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

app.get("/viewMartyr", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;


    Users.findById(user).then((user) => {
        console.log(typeof user._id);
        martyr.findById(id).then((post) => {
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
                        if(post.martyrCreator == user.email){
                            post.canEdit = true;
                            console.log(post);
                            res.render('viewMartyr.hbs', post);
                        } else {
                            res.render('viewMartyr.hbs', post);
                        }
                    }

                }
            } else {
                if(post.martyrCreator == user.email){
                    post.canEdit = true;
                    res.render('viewMartyr.hbs', post);
                } else {
                    res.render('viewMartyr.hbs', post);
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

app.get("/viewAchiever", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;


    Users.findById(user).then((user) => {
        console.log(typeof user._id);
        achiever.findById(id).then((post) => {
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
                        if(post.achieverCreator == user.email){
                            post.canEdit = true;
                            console.log(post);
                            res.render('viewAchiever.hbs', post);
                        } else {
                            res.render('viewAchiever.hbs', post);
                        }
                    }

                }
            } else {
                if(post.achieverCreator == user.email){
                    post.canEdit = true;
                    res.render('viewAchiever.hbs', post);
                } else {
                    res.render('viewAchiever.hbs', post);
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
app.get("/viewBearer", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;


    Users.findById(user).then((user) => {
        console.log(typeof user._id);
        bearer.findById(id).then((post) => {
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
                        if(post.bearerCreator == user.email){
                            post.canEdit = true;
                            console.log(post);
                            res.render('viewBearer.hbs', post);
                        } else {
                            res.render('viewBearer.hbs', post);
                        }
                    }

                }
            } else {
                if(post.bearerCreator == user.email){
                    post.canEdit = true;
                    res.render('viewBearer.hbs', post);
                } else {
                    res.render('viewBearer.hbs', post);
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
app.get("/editHomage", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;
    Users.findById(user).then((user) => {
        homage.findById(id).then((found) => {
            if(found.homageCreator == user.email){
                res.render('editHomage.hbs', found);
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
});app.get("/editCoverage", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;
    Users.findById(user).then((user) => {
        coverage.findById(id).then((found) => {
            if(found.coverageCreator == user.email){
                res.render('editCoverage.hbs', found);
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

app.get("/editBearer", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;
    Users.findById(user).then((user) => {
        bearer.findById(id).then((found) => {
            if(found.bearerCreator == user.email){
                res.render('editBearer.hbs', found);
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


app.get("/editMartyr", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;
    Users.findById(user).then((user) => {
        martyr.findById(id).then((found) => {
            if(found.martyrCreator == user.email){
                res.render('editMartyr.hbs', found);
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
});app.get("/editAchiever", authenticate, function (req, res) {
    var id = req.query.id;
    var user = req.session.userId;
    Users.findById(user).then((user) => {
        achiever.findById(id).then((found) => {
            if(found.achieverCreator == user.email){
                res.render('editAchiever.hbs', found);
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

const storage = new GridFsStorage({
    url: database,
    file: (req, file) => {
        if(!file){
            return resolve();
        }
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



app.post("/editEvent", [authenticate,  upload.single("eventImage"),], function (req, res) {
    // console.log(req.body);
    var user = req.session.userId;
    Users.findById(user).then((user) => {

                var body = _.pick(req.body, ['eventName', 'eventDate', 'eventOrganizer', 'eventNotes', 'eventLocation', 'imageName', 'eventRepeatFreq', 'eventRepeatDate', 'idOfEvent']);
                body.eventDate = req.body.eventDates;
                body.eventCreator = user.email;
                var obj = new ObjectID(req.body.idOfEvent);

                if (req.body.imageName == null || req.body.imageName == undefined || req.body.imageName == "" || !req.body.imageName) {


                    events.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                        res.render('editEvent.hbs', updated);
                    }, (e) => {
                        res.send(e);
                    }).catch((e) => {
                        res.send(e);
                    });
                } else {


                    gfs.remove({filename: req.body.idOfEventImage, root: 'images'}, (err, gridStore) => {
                        if (err) {
                            return res.status(404).json({err: err});
                        } else {
                            body.eventImage = req.file.filename;
                            events.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                                res.render('editEvent.hbs', updated);

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

app.get("/getImage", function (req, res) {
    var id = req.query.imageId;

    gfs.collection('images')
    gfs.files.findOne({ filename: id}, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "No file exists"
            });
        } else {
            res.contentType("image/png");
             const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
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
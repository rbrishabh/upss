var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var randomize = require('randomatic');
const _ = require('lodash');
const {events} = require('./../models/events');
const {homage} = require('./../models/homage');
var {ObjectID} = require('mongodb')
const crypto = require('crypto');
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
var path = require("path");




const {authenticate,authenticated} = require('./../middleware/authenticate');

var home = express.Router();

// middleware that is specific to this router
home.use(function timeLog (req, res, next) {
    next();
});

home.get('/', function (req, res) {
    if (req.session && req.session.userId) {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            events.find().limit(3).then((results)=> {
                homage.find().limit(3).then((results1) => {
                    console.log(typeof results, results[0]);
                    user.results = results;
                    user.results1 = results1;
                    res.render('home.hbs', user);
                });
            });
        }, (e) => {
            console.log(e);
            res.send(e);
            // res.render('editEvent.hbs', {msg: "fail"});
        }).catch((e) => {
            // console.log(e);
            res.send(e);
            // res.render('editEvent.hbs', {msg: "fail"});
        });
    } else {
        events.find().limit(3).then((results)=> {
            homage.find().limit(3).then((results1) => {
                console.log(typeof results, results[0]);
                var user = {};
                user.results = results;
                user.results1 = results1;
                res.render('home.hbs', user);
            });
        });
        }

});


home.post(
    '/homageComment',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            homage.findById(req.query.id)
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
                    post.save().then(post => res.redirect('/viewHomage?id='+req.query.id));
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

home.post(
    '/editCommentHomage',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            homage.findById(req.query.id)
                .then(post => {
                    console.log(post);
                    var commentId = req.query.commentId;


                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    post.comments[foundIndex].text = req.body.editedComment;
                    // Save
                    post.save().then(post => res.redirect('/viewHomage?id='+req.query.id));
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


home.post(
    '/editCommentReplyHomage',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            homage.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    var replyId = req.query.replyId;

                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    console.log(foundIndex);
                    var anotherIndex = post.comments[foundIndex].commentReplies.findIndex(comment=> comment.replyId.toString() === replyId.toString());
                    post.comments[foundIndex].commentReplies[anotherIndex].text = req.body.editedReply;
                    // Save
                    post.save().then(post => res.redirect('/viewHomage?id='+req.query.id));
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

home.get(
    '/homageCommentDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            homage.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    post.comments = post.comments.filter( comment=> comment.commentId.toString() !== commentId.toString());
                    post.save().then(post => res.redirect('/viewHomage?id='+req.query.id));
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

home.post(
    '/homageCommentReply',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            homage.findById(req.query.id)
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
                            post.save().then(post => res.redirect('/viewHomage?id='+req.query.id));

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

home.get(
    '/homageCommentReplyDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            homage.findById(req.query.id)
                .then(post => {
                    console.log(post.comments[0])

                    for(var i = 0; i < post.comments.length; i++){
                        var cid = new ObjectID(req.query.commentId)
                        if(post.comments[i].commentId.equals(cid)){
                            var replyId = req.query.replyId;
                            post.comments[i].commentReplies = post.comments[i].commentReplies.filter( reply=> reply.replyId.toString() !== replyId.toString());
                            post.save().then(post => res.redirect('/viewHomage?id='+req.query.id));

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

home.post(
    '/homageCommentLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            homage.findById(req.query.id)
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


home.post(
    '/homageCommentReplyLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            homage.findById(req.query.id)
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
                    bucketName: "homages"
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });



home.post("/editHomage", [authenticate,  upload.single("homageImage"),], function (req, res) {
    // console.log(req.body);
    var user = req.session.userId;
    Users.findById(user).then((user) => {

        var body = _.pick(req.body, ['homageName', 'homageDate', 'homageSchoolNo', 'homageNotes', 'homageBackground', 'imageName', 'idOfHomage']);
        body.homageDate = req.body.homageDates;
        body.homageRank = req.body.homageRank;
        body.homageCreator = user.email;
        var obj = new ObjectID(req.body.idOfHomage);

        if (req.body.imageName == null || req.body.imageName == undefined || req.body.imageName == "" || !req.body.imageName) {


            homage.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {

                res.render('editHomage.hbs', updated);
            }, (e) => {
                res.send(e);
            }).catch((e) => {
                res.send(e);
            });
        } else {


            gfs.remove({filename: req.body.idOfHomageImage, root: 'homages'}, (err, gridStore) => {
                if (err) {
                    return res.status(404).json({err: err});
                } else {
                    body.homageImage = req.file.filename;
                    homage.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                        res.render('editHomage.hbs', updated);

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



home.get("/getHomageImage", function (req, res) {
    var id = req.query.imageId;

    gfs.collection('homages')

    gfs.files.findOne({ filename: id}, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "No file exists"
            });
        } else {
            res.contentType("image/jpeg");
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
    });
});
module.exports = home;

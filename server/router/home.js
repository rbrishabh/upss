var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var randomize = require('randomatic');
const _ = require('lodash');
const {events} = require('./../models/events');
const {homage} = require('./../models/homage');
const {martyr} = require('./../models/martyr');
const {achiever} = require('./../models/achiever');
const {bearer} = require('./../models/bearer');
const {coverage} = require('./../models/coverage');
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
            events.find().limit(3).then((results) => {
                homage.find().limit(3).then((results1) => {
                    martyr.find().limit(4).then((results2) => {
                        achiever.find().limit(4).then((results3) => {
                            bearer.find().limit(2).then((results4) => {
                                coverage.find().limit(4).then((results5) => {
                                    Users.find({birthdayMonth: new Date().getMonth() + 1}).then((results6) => {
                                        console.log(typeof results, results[0]);
                                        user.results = results;
                                        user.results1 = results1;
                                        user.results2 = results2;
                                        user.results3 = results3;
                                        user.results4 = results4;
                                        user.results5 = results5;
                                        const monthNames = ["January", "February", "March", "April", "May", "June",
                                            "July", "August", "September", "October", "November", "December"
                                        ];
                                        for(var i= 0; i < results6.length; i++){
                                            results6[i].date = results6[i].dob.split('-')[2];
                                            results6[i].month = results6[i].dob.split('-')[1];
                                            results6[i].monthName = monthNames[results6[i].month-1];
                                        }

                                        user.results6 = results6;
                                        console.log(results6);
                                        console.log(results, results1, results2, results3)
                                        res.render('home.hbs', user);
                                    });
                                });
                            });
                        });
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
        });
    } else {
        events.find().limit(3).then((results)=> {
            homage.find().limit(3).then((results1) => {
                martyr.find().limit(4).then((results2) => {
                    achiever.find().limit(4).then((results3) => {
                        bearer.find().limit(2).then((results4) => {
                            coverage.find().limit(4).then((results5) => {
                                Users.find({birthdayMonth: new Date().getMonth() + 1}).then((results6) => {
                                    console.log(typeof results, results[0]);
                                    var user = {};
                                    user.results = results;
                                    user.results1 = results1;
                                    user.results2 = results2;
                                    user.results3 = results3;
                                    user.results4 = results4;
                                    user.results5 = results5;
                                    user.results6 = results6;
                                    res.render('home.hbs', user);
                                });
                            });
                        });
                    });
                });
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

home.post(
    '/martyrComment',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            martyr.findById(req.query.id)
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
                    post.save().then(post => res.redirect('/viewMartyr?id='+req.query.id));
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
    '/editCommentMartyr',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            martyr.findById(req.query.id)
                .then(post => {
                    console.log(post);
                    var commentId = req.query.commentId;


                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    post.comments[foundIndex].text = req.body.editedComment;
                    // Save
                    post.save().then(post => res.redirect('/viewMartyr?id='+req.query.id));
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
    '/editCommentReplyMartyr',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            martyr.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    var replyId = req.query.replyId;

                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    console.log(foundIndex);
                    var anotherIndex = post.comments[foundIndex].commentReplies.findIndex(comment=> comment.replyId.toString() === replyId.toString());
                    post.comments[foundIndex].commentReplies[anotherIndex].text = req.body.editedReply;
                    // Save
                    post.save().then(post => res.redirect('/viewMartyr?id='+req.query.id));
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
    '/martyrCommentDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            martyr.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    post.comments = post.comments.filter( comment=> comment.commentId.toString() !== commentId.toString());
                    post.save().then(post => res.redirect('/viewMartyr?id='+req.query.id));
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
    '/martyrCommentReply',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            martyr.findById(req.query.id)
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
                            post.save().then(post => res.redirect('/viewMartyr?id='+req.query.id));

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
    '/martyrCommentReplyDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            martyr.findById(req.query.id)
                .then(post => {
                    console.log(post.comments[0])

                    for(var i = 0; i < post.comments.length; i++){
                        var cid = new ObjectID(req.query.commentId)
                        if(post.comments[i].commentId.equals(cid)){
                            var replyId = req.query.replyId;
                            post.comments[i].commentReplies = post.comments[i].commentReplies.filter( reply=> reply.replyId.toString() !== replyId.toString());
                            post.save().then(post => res.redirect('/viewMartyr?id='+req.query.id));

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
    '/martyrCommentLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            martyr.findById(req.query.id)
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
    '/martyrCommentReplyLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            martyr.findById(req.query.id)
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
);home.post(
    '/achieverComment',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            achiever.findById(req.query.id)
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
                    post.save().then(post => res.redirect('/viewAchiever?id='+req.query.id));
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
    '/editCommentAchiever',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            achiever.findById(req.query.id)
                .then(post => {
                    console.log(post);
                    var commentId = req.query.commentId;


                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    post.comments[foundIndex].text = req.body.editedComment;
                    // Save
                    post.save().then(post => res.redirect('/viewAchiever?id='+req.query.id));
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
    '/editCommentReplyAchiever',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            achiever.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    var replyId = req.query.replyId;

                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    console.log(foundIndex);
                    var anotherIndex = post.comments[foundIndex].commentReplies.findIndex(comment=> comment.replyId.toString() === replyId.toString());
                    post.comments[foundIndex].commentReplies[anotherIndex].text = req.body.editedReply;
                    // Save
                    post.save().then(post => res.redirect('/viewAchiever?id='+req.query.id));
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
    '/achieverCommentDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            achiever.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    post.comments = post.comments.filter( comment=> comment.commentId.toString() !== commentId.toString());
                    post.save().then(post => res.redirect('/viewAchiever?id='+req.query.id));
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
    '/achieverCommentReply',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            achiever.findById(req.query.id)
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
                            post.save().then(post => res.redirect('/viewAchiever?id='+req.query.id));

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
    '/achieverCommentReplyDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            achiever.findById(req.query.id)
                .then(post => {
                    console.log(post.comments[0])

                    for(var i = 0; i < post.comments.length; i++){
                        var cid = new ObjectID(req.query.commentId)
                        if(post.comments[i].commentId.equals(cid)){
                            var replyId = req.query.replyId;
                            post.comments[i].commentReplies = post.comments[i].commentReplies.filter( reply=> reply.replyId.toString() !== replyId.toString());
                            post.save().then(post => res.redirect('/viewAchiever?id='+req.query.id));

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
    '/achieverCommentLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            achiever.findById(req.query.id)
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
    '/achieverCommentReplyLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            achiever.findById(req.query.id)
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
);home.post(
    '/bearerComment',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            bearer.findById(req.query.id)
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
                    post.save().then(post => res.redirect('/viewBearer?id='+req.query.id));
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
    '/editCommentBearer',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            bearer.findById(req.query.id)
                .then(post => {
                    console.log(post);
                    var commentId = req.query.commentId;


                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    post.comments[foundIndex].text = req.body.editedComment;
                    // Save
                    post.save().then(post => res.redirect('/viewBearer?id='+req.query.id));
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
    '/editCommentReplyBearer',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            bearer.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    var replyId = req.query.replyId;

                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    console.log(foundIndex);
                    var anotherIndex = post.comments[foundIndex].commentReplies.findIndex(comment=> comment.replyId.toString() === replyId.toString());
                    post.comments[foundIndex].commentReplies[anotherIndex].text = req.body.editedReply;
                    // Save
                    post.save().then(post => res.redirect('/viewBearer?id='+req.query.id));
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
    '/bearerCommentDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            bearer.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    post.comments = post.comments.filter( comment=> comment.commentId.toString() !== commentId.toString());
                    post.save().then(post => res.redirect('/viewBearer?id='+req.query.id));
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
    '/bearerCommentReply',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            bearer.findById(req.query.id)
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
                            post.save().then(post => res.redirect('/viewBearer?id='+req.query.id));

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
    '/bearerCommentReplyDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            bearer.findById(req.query.id)
                .then(post => {
                    console.log(post.comments[0])

                    for(var i = 0; i < post.comments.length; i++){
                        var cid = new ObjectID(req.query.commentId)
                        if(post.comments[i].commentId.equals(cid)){
                            var replyId = req.query.replyId;
                            post.comments[i].commentReplies = post.comments[i].commentReplies.filter( reply=> reply.replyId.toString() !== replyId.toString());
                            post.save().then(post => res.redirect('/viewBearer?id='+req.query.id));

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
    '/bearerCommentLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            bearer.findById(req.query.id)
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
    '/bearerCommentReplyLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            bearer.findById(req.query.id)
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
);home.post(
    '/coverageComment',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            coverage.findById(req.query.id)
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
                    post.save().then(post => res.redirect('/viewCoverage?id='+req.query.id));
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
    '/editCommentCoverage',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            coverage.findById(req.query.id)
                .then(post => {
                    console.log(post);
                    var commentId = req.query.commentId;


                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    post.comments[foundIndex].text = req.body.editedComment;
                    // Save
                    post.save().then(post => res.redirect('/viewCoverage?id='+req.query.id));
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
    '/editCommentReplyCoverage',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            coverage.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    var replyId = req.query.replyId;

                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    console.log(foundIndex);
                    var anotherIndex = post.comments[foundIndex].commentReplies.findIndex(comment=> comment.replyId.toString() === replyId.toString());
                    post.comments[foundIndex].commentReplies[anotherIndex].text = req.body.editedReply;
                    // Save
                    post.save().then(post => res.redirect('/viewCoverage?id='+req.query.id));
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
    '/coverageCommentDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            coverage.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    post.comments = post.comments.filter( comment=> comment.commentId.toString() !== commentId.toString());
                    post.save().then(post => res.redirect('/viewCoverage?id='+req.query.id));
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
    '/coverageCommentReply',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            coverage.findById(req.query.id)
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
                            post.save().then(post => res.redirect('/viewCoverage?id='+req.query.id));

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
    '/coverageCommentReplyDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            coverage.findById(req.query.id)
                .then(post => {
                    console.log(post.comments[0])

                    for(var i = 0; i < post.comments.length; i++){
                        var cid = new ObjectID(req.query.commentId)
                        if(post.comments[i].commentId.equals(cid)){
                            var replyId = req.query.replyId;
                            post.comments[i].commentReplies = post.comments[i].commentReplies.filter( reply=> reply.replyId.toString() !== replyId.toString());
                            post.save().then(post => res.redirect('/viewCoverage?id='+req.query.id));

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
    '/coverageCommentLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            coverage.findById(req.query.id)
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
    '/coverageCommentReplyLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            coverage.findById(req.query.id)
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
home.post(
    '/birthdayComment',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            Users.findById(req.query.id)
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
                    post.save().then(post => res.redirect('/viewBirthday?id='+req.query.id));
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
    '/editCommentBirthday',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            Users.findById(req.query.id)
                .then(post => {
                    console.log(post);
                    var commentId = req.query.commentId;


                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    post.comments[foundIndex].text = req.body.editedComment;
                    // Save
                    post.save().then(post => res.redirect('/viewBirthday?id='+req.query.id));
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
    '/editCommentReplyBirthday',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            Users.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    var replyId = req.query.replyId;

                    var foundIndex = post.comments.findIndex(comment=> comment.commentId.toString() === commentId.toString());
                    console.log(foundIndex);
                    var anotherIndex = post.comments[foundIndex].commentReplies.findIndex(comment=> comment.replyId.toString() === replyId.toString());
                    post.comments[foundIndex].commentReplies[anotherIndex].text = req.body.editedReply;
                    // Save
                    post.save().then(post => res.redirect('/viewBirthday?id='+req.query.id));
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
    '/birthdayCommentDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            Users.findById(req.query.id)
                .then(post => {
                    var commentId = req.query.commentId;
                    post.comments = post.comments.filter( comment=> comment.commentId.toString() !== commentId.toString());
                    post.save().then(post => res.redirect('/viewBirthday?id='+req.query.id));
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
    '/birthdayCommentReply',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            Users.findById(req.query.id)
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
                            post.save().then(post => res.redirect('/viewBirthday?id='+req.query.id));

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
    '/birthdayCommentReplyDelete',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            console.log(req.query, req.body)
            Users.findById(req.query.id)
                .then(post => {
                    console.log(post.comments[0])

                    for(var i = 0; i < post.comments.length; i++){
                        var cid = new ObjectID(req.query.commentId)
                        if(post.comments[i].commentId.equals(cid)){
                            var replyId = req.query.replyId;
                            post.comments[i].commentReplies = post.comments[i].commentReplies.filter( reply=> reply.replyId.toString() !== replyId.toString());
                            post.save().then(post => res.redirect('/viewBirthday?id='+req.query.id));

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
    '/birthdayCommentLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            Users.findById(req.query.id)
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
    '/birthdayCommentReplyLike',
    authenticate,
    (req, res) => {
        var user = req.session.userId;
        Users.findById(user).then((user) => {
            Users.findById(req.query.id)
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
                    bucketName: "images"
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


            gfs.remove({filename: req.body.idOfHomageImage, root: 'images'}, (err, gridStore) => {
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
home.post("/editBearer", [authenticate,  upload.single("bearerImage"),], function (req, res) {
    // console.log(req.body);
    var user = req.session.userId;
    Users.findById(user).then((user) => {

        var body = _.pick(req.body, ['bearerPost','bearerName', 'bearerFromDate','bearerToDate', 'bearerSchoolNo', 'bearerRank', 'bearerBackground', 'imageName', 'idOfBearer']);
        body.bearerFromDate = req.body.bearerFromDates;
        body.bearerToDate = req.body.bearerToDates;
        body.bearerRank = req.body.bearerRank;
        body.bearerCreator = user.email;
        var obj = new ObjectID(req.body.idOfBearer);

        if (req.body.imageName == null || req.body.imageName == undefined || req.body.imageName == "" || !req.body.imageName) {


            bearer.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {

                res.render('editBearer.hbs', updated);
            }, (e) => {
                res.send(e);
            }).catch((e) => {
                res.send(e);
            });
        } else {


            gfs.remove({filename: req.body.idOfBearerImage, root: 'images'}, (err, gridStore) => {
                if (err) {
                    return res.status(404).json({err: err});
                } else {
                    body.bearerImage = req.file.filename;
                    bearer.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                        res.render('editBearer.hbs', updated);

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

home.post("/editProfile", [authenticate,  upload.single("profileImage"),], function (req, res) {
    // console.log(req.body);
    var user = req.session.userId;
    Users.findById(user).then((user) => {

        var body = _.pick(req.body, ['sn', 'house', 'dob', 'yoj', 'pyear', 'address', 'country', 'city', 'zip', 'lno', 'email', 'password', 'name', 'mobile', 'occupation', 'oaddress', 'ocountry', 'ocity', 'ozip', 'olno', 'faname', 'maname', 'maritalStatus', 'remarks', 'web', 'faxno', 'fb', 'omobile', 'imageName']);
        if(body.mobile && body.mobile.length!= 13){
            body.mobile = "+91" + body.mobile;
            body.mobile = body.mobile.replace(/\-/g,"");
        }

        if(!body.country){
            body.country = user.country;
        }

        if(!body.ocountry){
            body.ocountry = user.ocountry;
        }

        if(body.omobile && body.omobile.length!= 13){
            body.omobile = "+91" + body.omobile;
            body.omobile = body.omobile.replace(/\-/g,"");
        }


        var arr = body.dob.split('-');

        console.log(arr[1]);
        body.birthdayMonth = arr[1];
        var obj = new ObjectID(req.session.userId);

        if (req.body.imageName == null || req.body.imageName == undefined || req.body.imageName == "" || !req.body.imageName) {


            Users.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                updated.success = true;
                updated.msg = "Edited successfully!";
                res.render('profile.hbs', updated);
            }, (e) => {

                console.log(e)
                var err = e.errmsg;

                if (err.indexOf("email_1") != -1) {
                    var user = {};
                    user.msg = 'Email-Id already exists';
                    user.err = true;
                    res.render('profile.hbs', user);

                } else if (err.indexOf("mobile_1") != -1) {
                    var user = {};
                    user.msg = 'Mobile already exists';
                    user.err = true;
                    res.render('profile.hbs', user);
                } else {
                    var user = {};
                    console.log(e);
                    user.msg = 'Something went wrong, please try again.';
                    user.err = true;
                    res.render('profile.hbs', user);
                }
            }).catch((e) => {
                var user = {};
                console.log(e);
                user.err = true;
                user.msg = 'Something went wrong, please try again.';
                res.render('profile.hbs', user);
            });

        } else {

            if (req.body.idOfProfileImage) {
                gfs.remove({filename: req.body.idOfProfileImage, root: 'images'}, (err, gridStore) => {
                    if (err) {
                        return res.status(404).json({err: err});
                    } else {
                        body.profileImage = req.file.filename;
                        var arr = body.dob.split('-');

                        console.log(arr[1]);
                        body.birthdayMonth = arr[1];
                        Users.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                            updated.success = true;
                            updated.msg = "Edited successfully!";
                            res.render('profile.hbs', updated);

                        }, (e) => {

                            console.log(e)
                            var err = e.errmsg;

                            if (err.indexOf("email_1") != -1) {
                                var user = {};
                                user.msg = 'Email-Id already exists';
                                user.err = true;
                                res.render('profile.hbs', user);

                            } else if (err.indexOf("mobile_1") != -1) {
                                var user = {};
                                user.msg = 'Mobile already exists';
                                user.err = true;
                                res.render('profile.hbs', user);
                            } else {
                                var user = {};
                                console.log(e);
                                user.msg = 'Something went wrong, please try again.';
                                user.err = true;
                                res.render('profile.hbs', user);
                            }
                        }).catch((e) => {
                            var user = {};
                            console.log(e);
                            user.err = true;
                            user.msg = 'Something went wrong, please try again.';
                            res.render('profile.hbs', user);
                        });
                    }
                });
            } else {
                body.profileImage = req.file.filename;
                var arr = body.dob.split('-');

                console.log(arr[1]);
                body.birthdayMonth = arr[1];
                Users.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                    updated.success = true;
                    updated.msg = "Edited successfully!";
                    res.render('profile.hbs', updated);

                }, (e) => {

                    console.log(e)
                    var err = e.errmsg;

                    if (err.indexOf("email_1") != -1) {
                        var user = {};
                        user.msg = 'Email-Id already exists';
                        user.err = true;
                        res.render('profile.hbs', user);

                    } else if (err.indexOf("mobile_1") != -1) {
                        var user = {};
                        user.msg = 'Mobile already exists';
                        user.err = true;
                        res.render('profile.hbs', user);
                    } else {
                        var user = {};
                        console.log(e);
                        user.msg = 'Something went wrong, please try again.';
                        user.err = true;
                        res.render('profile.hbs', user);
                    }
                }).catch((e) => {
                    var user = {};
                    console.log(e);
                    user.err = true;
                    user.msg = 'Something went wrong, please try again.';
                    res.render('profile.hbs', user);
                });
            }
        }



    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });

});home.post("/editCoverage", [authenticate,  upload.single("coverageImage"),], function (req, res) {
    // console.log(req.body);
    var user = req.session.userId;
    Users.findById(user).then((user) => {

        var body = _.pick(req.body, ['coverageNewsHeading','coverageDetails','imageName', 'idOfCoverage']);
        
        body.coverageCreator = user.email;
        var obj = new ObjectID(req.body.idOfCoverage);

        if (req.body.imageName == null || req.body.imageName == undefined || req.body.imageName == "" || !req.body.imageName) {


            coverage.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {

                res.render('editCoverage.hbs', updated);
            }, (e) => {
                res.send(e);
            }).catch((e) => {
                res.send(e);
            });
        } else {


            gfs.remove({filename: req.body.idOfCoverageImage, root: 'images'}, (err, gridStore) => {
                if (err) {
                    return res.status(404).json({err: err});
                } else {
                    body.coverageImage = req.file.filename;
                    coverage.findOneAndUpdate({_id: obj}, {$set: body}, {new: true}).then((updated) => {
                        res.render('editCoverage.hbs', updated);

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

    gfs.collection('images')

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

home.get("/getMartyrImage", function (req, res) {
    var id = req.query.imageId;

    gfs.collection('images')

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

home.get("/getAchieverImage", function (req, res) {
    var id = req.query.imageId;

    gfs.collection('images')

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
});home.get("/getBearerImage", function (req, res) {
    var id = req.query.imageId;

    gfs.collection('images')

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
});home.get("/getCoverageImage", function (req, res) {
    var id = req.query.imageId;

    gfs.collection('images')

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

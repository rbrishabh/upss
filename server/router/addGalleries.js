var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
const {gallery} = require('./../models/gallery');
var randomize = require('randomatic');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");

var addGalleries = express.Router();

// middleware that is specific to this router
addGalleries.use(function timeLog (req, res, next) {
    next();
});

addGalleries.get('/', authenticate, function (req, res) {
    res.render('addGalleries.hbs');
});

const storage = new GridFsStorage({
    url: database,
    file: (req, file) => {
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







addGalleries.post('/',[authenticate,  upload.array("galleryImage"),], (req,res)=> {
    var user = req.session.userId;
    var obj = {};
    Users.findById(user).then((user) => {
        var body = _.pick(req.body, ['galleryName', 'galleryDate']);
        body.galleriesImage = [];

        body.galleriesImage = req.files;
        console.log(req.files);
        body.galleriesStatus = "Unconfirmed"
        body.galleriesCreator = user.email;
        var newGalleries = new gallery(body);
        newGalleries.save().then((galleries) => {
            if (galleries) {

                res.redirect('/allGalleries');

            }

        }, (e) => {
            console.log(e);
            res.render('addGalleries.hbs',  {msg:"fail"});
        }, (e) => {
            console.log(e);
            res.render('addGalleries.hbs',  {msg:"fail"});
        }).catch((e) => {
            console.log(e);
            res.render('addGalleries.hbs',  {msg:"fail"});
        });
    }, (e) => {
        console.log(e);
        res.redirect("/login");
    }).catch((e) => {
        console.log(e);
        res.send(e);
    });

});




module.exports = addGalleries;

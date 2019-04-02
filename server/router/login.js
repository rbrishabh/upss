var express = require('express');
var moment = require('moment');
const {Users} = require('./../models/users');
var randomize = require('randomatic');
const _ = require('lodash');
const {authenticate,authenticated} = require('./../middleware/authenticate');

var login = express.Router();

// middleware that is specific to this router
login.use(function timeLog (req, res, next) {
    next();
});

login.get('/', authenticated, function (req, res) {
    res.render('login.hbs');
});

login.post('/',authenticated, (req,res)=> {
    var body = _.pick(req.body, ['email', 'password']);
    var username = body.email;
    var password = body.password;
    // console.log(username);

    if(password){
        console.log('reached!!')
        Users.findByCredentials(username, password).then((user) => {

            req.session.userId = user._id;
            res.redirect('/');
         }, (e)=>{
            // console.log(e, "asd");
            res.render('login.hbs', {
                err:true
            });
        }).catch((e) => {
            res.render('login.hbs', {
                err:true
            });
        });
    }


});




module.exports = login;

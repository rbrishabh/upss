var express = require("express");
var helmet = require("helmet");
const randomize = require("randomatic");
const moment = require('moment');
const hbs = require('hbs');
const _ = require('lodash');
const session = require('express-session')
var MongoStore = require('connect-mongo')(session)
const request = require('request');
const bodyParser = require('body-parser');
var morgan = require("morgan");
var compression = require("compression");


//models and db
const{Users}= require('./models/users');
const {authenticate,authenticated} = require('./middleware/authenticate');
var {mongoose,db} = require('./db/mongoose');

//router
var signUp = require('./router/signUp');
var login = require('./router/login');
var addEvent = require('./router/addEvent');
var home = require('./router/home');


var app = express();
var toHttps = require('express-to-https').basic;
app.use(toHttps);

const port = process.env.PORT || 80;

app.set('view engine', 'hbs');
app.use(express.static(__dirname+'./../views'));





app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
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
app.use('/login', login);

app.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.redirect('/');
            }

        });
    }
    else res.redirect('/');
});


app.use(compression());



app.listen(port, function() {
    console.log(`Server started on PORT ${port}.`);
});
const {Users} = require('./../models/users');

function authenticate(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
}
function authenticated(req, res, next) {
    if (req.session && req.session.userId) {
        res.redirect('/');
    } else {
        next();
    }
}

module.exports = {authenticate,authenticated};
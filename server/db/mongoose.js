const mongoose = require('mongoose');
const urlLocal = 'mongodb://localhost:27017/alumni';
// const urlDeploy = process.env.URI;
const database =  urlLocal;
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(database,{
    useNewUrlParser:true
});


module.exports = {mongoose,db};

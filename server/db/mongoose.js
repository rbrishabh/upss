const mongoose = require('mongoose');
const database =   process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni2';
const gridfs = require('mongoose-gridfs');

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    global.attachmentGrid = gridfs({
        collection: 'images',
        model: 'Image',
        mongooseConnection: db
    });
});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(database,{
    useNewUrlParser:true
});



module.exports = {mongoose,db};

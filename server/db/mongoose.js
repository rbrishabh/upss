const mongoose = require('mongoose');
const database =   process.env.MONGODB_URI || 'mongodb://localhost:27017/alumni';
global.database = database;
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");


const conn = mongoose.createConnection(database);



//init gfs
let gfs;
//handle mongo error
conn.on('error', console.error.bind(console, 'connection error:'));
conn.once('open', function () {
    // we're connected!
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection("images");

    global.gfs = gfs;
});
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(database,{
    useNewUrlParser: true
});



module.exports = {mongoose,conn};

const mongoose = require('mongoose');


var eventsSchema = new mongoose.Schema({
    eventName: {
        type: String,
        trim:true,
        required:true
    },
    eventCreator: {
        type: String,
        trim:true,
        required:true
    },
    eventDate: {
        type: String,
        trim:true,
        required:true
    },
    eventOrganizer: {
        type: String,
        trim:true,
        required:true
    },
    eventNotes: {
        type: String,
        trim:true,
        required:true
    },
    eventLocation: {
        type: String,
        trim:true,
        required:true
    },
    eventRepeatFreq: {
        type: String,
        trim:true,
        required:true
    },
    eventRepeatDate: {
        type: String,
        trim:true
    },
    eventImage: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        trim:true
    },
    eventStatus: {
        type: String,
        trim:true
    }
});




var events = mongoose.model('events',eventsSchema);
module.exports =  {events};

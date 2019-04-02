const mongoose = require('mongoose');
var {ObjectID} = require('mongodb')


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
    },
    // likes: [{
    //     user: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         required: true
    //     },
    //     name: {
    //         type: String
    //     },
    //     avatar: {
    //         type: mongoose.Schema.Types.ObjectId,
    //     },
    //     date: {
    //         type: Date,
    //         default: Date.now
    //     }
    // }],
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
            commentId: {
                type: mongoose.Schema.Types.ObjectId,
                default: new ObjectID()
            },
            email:{
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: mongoose.Schema.Types.ObjectId,
            },
            date: {
                type: Date,
                default: Date.now
            },
            likes: [{
                user: {
                    type: mongoose.Schema.Types.ObjectId
                },
                email:{
                    type: String,
                },
                name: {
                    type: String
                },
                avatar: {
                    type: mongoose.Schema.Types.ObjectId,
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }],
            commentReplies: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    replyId: {
                        type: mongoose.Schema.Types.ObjectId,
                        default: new ObjectID()
                    },
                    email:{
                        type: String,
                    },
                    text: {
                        type: String,
                    },
                    name: {
                        type: String
                    },
                    avatar: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    date: {
                        type: Date,
                        default: Date.now
                    },
                    likes: [{
                        user: {
                            type: mongoose.Schema.Types.ObjectId,
                            required: true
                        },
                        email:{
                            type: String,
                        },
                        name: {
                            type: String
                        },
                        avatar: {
                            type: mongoose.Schema.Types.ObjectId,
                        },
                        date: {
                            type: Date,
                            default: Date.now
                        }
                    }],
                }
            ],
        }
    ],
});




var events = mongoose.model('events',eventsSchema);
module.exports =  {events};

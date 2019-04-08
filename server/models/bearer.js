const mongoose = require('mongoose');
var {ObjectID} = require('mongodb')


var bearerSchema = new mongoose.Schema({
    bearerName: {
        type: String,
        trim:true,
        required:true
    },
    bearerSchoolNo: {
        type: String,
        trim:true,
        required:true
    },
    bearerFromDate: {
        type: String,
        trim:true,
        required:true
    },
    bearerToDate: {
        type: String,
        trim:true,
        required:true
    },
    bearerPost: {
        type: String,
        trim:true,
        required:true
    },
    bearerBackground: {
        type: String,
        trim:true,
        required:true
    },
    bearerImage: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        trim:true
    },
    bearerStatus: {
        type: String,
        trim:true
    },
    bearerCreator: {
        type: String,
        trim:true
    },
    bearerRank: {
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




var bearer = mongoose.model('bearer',bearerSchema);
module.exports =  {bearer};

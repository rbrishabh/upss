const mongoose = require('mongoose');
var {ObjectID} = require('mongodb')


var achieverSchema = new mongoose.Schema({
    achieverName: {
        type: String,
        trim:true,
        required:true
    },
    achieverSchoolNo: {
        type: String,
        trim:true,
        required:true
    },
    achieverNotes: {
        type: String,
        trim:true,
        required:true
    },
    achieverBackground: {
        type: String,
        trim:true,
        required:true
    },
    achieverImage: {
        type: String,
        required: true
    },
    imageName: {
        type: String,
        trim:true
    },
    achieverStatus: {
        type: String,
        trim:true
    },
    achieverCreator: {
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




var achiever = mongoose.model('achiever',achieverSchema);
module.exports =  {achiever};

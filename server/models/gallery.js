const mongoose = require('mongoose');
var {ObjectID} = require('mongodb')


var gallerySchema = new mongoose.Schema({
    galleryName: {
        type: String,
        trim:true,
        required:true
    },
    galleryDate: {
        type: String,
        trim:true,
        required:true
    },
    galleryAssociateId: {
        type: String,
        required: true
    },
    imageName: [{
        type: String,
        trim:true
    }],
    galleryImage: [{
        type: String,
        trim:true
    }],
    galleryCreator: {
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




var gallery = mongoose.model('gallery',gallerySchema);
module.exports =  {gallery};

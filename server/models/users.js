const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var {ObjectID} = require('mongodb')



var userSchema = new mongoose.Schema({
    sn: {
        type: String,
        required: true,
        trim:true
    },
    house: {
        type: String,
        required: true,
        trim:true
    },
    dob: {
        type: String,
        required: true,
        trim:true
    },
    birthdayMonth: {
        type: Number,
        required: true,
        trim:true
    },
    yoj: {
        type: String,
        required: true,
        trim:true
    },
    pyear: {
        type: String,
        required: true,
        trim:true
    },
    address: {
        type: String,
        required: true,
        trim:true
    },
    country: {
        type: String,
        required: true,
        trim:true
    },
    city: {
        type: String,
        required: true,
        trim:true
    },
    zip: {
        type: String,
        required: true,
        trim:true
    },
    lno: {
        type: String,
        required: true,
        trim:true
    },
    email: {
        type: String,
        required:true,
        unique:true,
        trim:true,
    },
    superAdmin : {
        type : Boolean,
        required: true
    },
    password:{
        type: String,
          required:true
    },
    name: {
        type: String,
        required: true,
        trim:true,
    },
    mobile: {
        unique:true,
        type: String,
        required: true,
        trim:true
    },
    occupation: {
        type: String,
        required: true,
        trim:true
    },
    oaddress: {
        type: String,
        trim:true
    },
    ocountry: {
        type: String,
        trim:true
    },
    ocity: {
        type: String,
        trim:true
    },
    ozip: {
        type: String,
        trim:true
    },
    imageName: {
        type: String,
        trim:true
    },
    omobile: {
        type: String,
        trim:true
    },
    olno: {
        type: String,
        trim:true
    },
    faname: {
        type: String,
        trim:true
    },
    maname: {
        type: String,
        trim:true
    },
    maritalStatus: {
        type: String,
        trim:true
    },
    remarks: {
        type: String,
        trim:true
    },
    web: {
        type: String,
        trim:true
    },
    faxno: {
        type: String,
        trim:true
    },
    fb: {
        type: String,
        trim:true
    },
    profileImage: {
        type: String,
        trim:true
    },
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
    ]
});


// userSchema.methods.toJSON = function () {
//     var user = this;
//     var userObject = user.toObject();
//     return _.pick(userObject, ['_id', 'name','occupation','mobile']);
// };


userSchema.statics.findByCredentials = function (email , password) {
    var Users = this;
    // console.log(username);
    return Users.findOne({email:email}).then((user)=>{
        // console.log(user);
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve,reject)=>{
            var hashedPass = user.password;
            bcrypt.compare(password,hashedPass,(err,res)=>{
                if(!res){
                    reject();
                }
                else {
                    resolve(user);
                }
            });
        });
    });
};


userSchema.pre('save', function (next) {
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err,salt)=>{
            bcrypt.hash(user.password, salt, (err,hash)=>{
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }

});

var Users = mongoose.model('Users', userSchema);

module.exports = {Users};
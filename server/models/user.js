const mongoose = require('mongoose');
const validator= require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();    
    
    user.tokens.push({access, token});
    
    return user.save().then(() => {
        return token;    
    });
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    
    try {
        decoded =  jwt.verify(token, 'abc123');        
    } catch (e) {
        /*
        return new Promise((resolve, reject) => {
            reject(e);    
        });
        */
        return Promise.reject(e);
    }
    
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
};

UserSchema.statics.findByCredential = function(email, password) {
    var User = this;
    
    return User.findOne({email}).then(function(user) {
       if (!user) {
           return Promise.reject("Invalid email");
       }
       
        return new Promise((resolve, reject) => {            
            bcrypt.compare(password, user.password, (err, res) => {                
                if (res) {
                    resolve(user);                        
                } else {
                    reject(err);
                }                
            });            
        });
    });
};

UserSchema.methods.removeToken = function(token) {
    var user = this;
    
    return user.update({
        $pull: {
            tokens: { token }
        }    
    });
};

UserSchema.pre('save', function(next) {
    var user = this;
    
    if (user.isModified('password')) {
        bcrypt.genSalt(9, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {                
                user.password = hash;
                next();
            });
        });
    } else {
        next();    
    }        
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
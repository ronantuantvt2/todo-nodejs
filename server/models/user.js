const mongoose = require('mongoose');
const validator= require('validator');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is invalid email.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

module.exports = {User};
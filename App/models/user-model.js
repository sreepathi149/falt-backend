const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    mobile:{
        type: Number,
        required: true,
        maxlength: 10,
        unique: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    role:{
        type: String,
        enum: ['admin', 'manager', 'fieldAgent', 'client'],
        default: 'admin'
    },
    subscriptionEndDate: {
        type: Date,
        required: true
    },
    otp:{
        type: Number
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User
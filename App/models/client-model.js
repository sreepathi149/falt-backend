const mongoose = require('mongoose')
const { Schema } = mongoose

const clientSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    requirement: {
        title: String,
        body: String
    },
    location: {
        latitude: String,
        longitude: String
    },
    address:{
        place: String,
        landmark: String,
        city: String,
        state: String,
        pincode: Number,
    },
    mobile:{
        type: Number,
        required: true,
        maxlength: 10,
        unique: true
    },
    alternateMobile: {
        type: Number,
        required: true,
        maxlength: 10,
        unique: true
    },
    otp:{
        type: Number
    }
}, {timeStamps: true})

const Client = mongoose.model('Client', clientSchema)

module.exports = Client

const mongoose = require('mongoose')
const { Schema } = mongoose

const employeeSchema = new Schema({
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
    company:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    address:{
        place: String,
        landmark: String,
        city: String,
        state: String,
        pincode: Number
    },
    role: {
        type: String,
        enum: ['manager', 'fieldAgent'],
        required: true
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
    reportTo:{
        type: String,
        required: true
    },
    subscriptionEndDate: {
        type: Date,
        required: true
    },
    location:[{
        lat: String,
        lng:String
    }],
    otp: {
        type: Number
    }
}, {timeStamps: true})

const Employee = mongoose.model('Employee', employeeSchema)

module.exports = Employee

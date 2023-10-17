const mongoose = require('mongoose')
const { Schema } = mongoose

const taskSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    client:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    company: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    assignedBy:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Employee'
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Employee'
    },
    location:{
        lat: String,
        lng: String
    },
    dueDate: {
        type: Date,
        default: Date.now(),
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'delayed'],
        required: true,
        default: 'pending'
    },
    fieldStatus: {
        type: []
    }
}, {timeStamps: true})

const Tasks = mongoose.model('Tasks', taskSchema)

module.exports = Tasks

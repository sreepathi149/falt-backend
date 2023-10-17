const mongoose = require('mongoose')
const { Schema } = mongoose

const paymentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    employee:{
        type: Schema.Types.ObjectId,
        ref: 'Employee'   
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'cash','upi', 'razorpay', 'card'],
        required: true,
        default: 'card'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
        required: true
    },
    paymentId : {
        type : String
    },
    paymentDate:{
        type : Date,
        default : new Date()
    }
}, {timestamps: true})

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment
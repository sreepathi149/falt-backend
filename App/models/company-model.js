const mongoose = require('mongoose')
const { Schema } = mongoose

const companySchema = new Schema({
    companyName:{
        type: String,
        required: true,
        unique: true
    },
    companyWebsite:{
        type: String,
        required: true,
        unique: true
    },
    companyAddress:{
            place: String,
            landmark: String,
            city: String,
            state: String,
            pincode: Number,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const Company = mongoose.model('Company', companySchema)

module.exports = Company

const mongoose = require('mongoose')
const { Schema } = mongoose

const categorySchema = new Schema({
    company: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Company'
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        required: true
    }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category


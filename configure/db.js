const mongoose = require('mongoose')

const configureDb = async () => {
    try {
        const db = await mongoose.connect('mongodb+srv://sreepathi:sreepathi@cluster1.iyiz7os.mongodb.net/?retryWrites=true&w=majority')
        console.log('connected to db')
    } catch(e) {
        console.log(e)
    }
}

module.exports = configureDb 
const User = require('../models/user-model')
const Employee = require("../models/employee-model")

const verifyUser = async (req, res, next) => {
    const {email, password} = req.body
    const currentDate = new Date()
    try {
        const user = await User.findOne({email: email })
        const employee = await Employee.findOne({email: email })
        if(user) {
            if(currentDate <= user.subscriptionEndDate) {
                next()
            } else {
                res.json('your free trail subsciption ended - please subscribe')
            }
        } else if(employee) {
            if(currentDate <= employee.subscriptionEndDate) {
                next()
            } else {
                res.json('your free trail subsciption ended - please subscribe')
            }
        } else {
            res.json({error: 'user not found'})
        }
    } catch(e) {
        res.json(e)
    }
} 

module.exports = verifyUser
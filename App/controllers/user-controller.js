const User = require('../models/user-model')
const bcrypt = require('bcryptjs')
const pick = require('lodash/pick')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const otp = require('otp-generator')
const Company = require('../models/company-model')
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
const sendMail = require('../helpers/send-mail')
uuidv4()

const userCltr = {}

userCltr.register = async (req, res) => {
    try {
        const body = pick(req.body, ['username', 'email', 'password', 'mobile'])
        const user = new User(body)
        const endDate = new Date()
        if(validator.isStrongPassword(user.password)) {
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(user.password, salt)
            user.password = hashedPassword
            user.subscriptionEndDate = new Date(endDate.setDate(endDate.getDate() + 14))
            const userDoc = await user.save()
            if(userDoc) {
                const body = pick(req.body, ['companyName', 'companyWebsite', 'companyAddress'])
                const company = new Company(body)
                company.owner = user._id
                const companyDoc = await company.save()
                res.json({
                    user: userDoc,
                    company: companyDoc
                })
            } else {
                res.json({
                    error: 'user data not found'
                })
            }
        } else {
            res.json({error: 'password is not strong enough'})
        }
        
    } catch(e) {
        res.json(e)
    }
}

userCltr.account = async (req, res) => {
    try{
        const user = await User.findById(req.user.id)
        res.json(pick(user, ['id', 'username', 'email', 'mobile']))
    } catch(e) {
        res.json(e)
    }
}
userCltr.update = async (req, res) => {
    try{
        const {username, email, mobile, password, role} = body = req.body
        const user = await User.findOneAndUpdate({_id: req.user.id}, body, {runValidators: true, new: true})
        res.json(pick(user, ['id', 'username', 'email', 'mobile']))
    } catch(e) {
        res.json(e)
    }
}

userCltr.company = async (req, res) => {
    try{
        const company = await Company.findById(req.user.company)
        res.json(company)
    } catch(e) {
        res.json(e)
    }
}

userCltr.updateCompanyDetails = async (req, res) => {
    try {
        const body = req.body
        const company = await Company.findOneAndUpdate({_id: req.user.company}, body, {runValidators: true, new: true})
        res.json(company)
    } catch(e) {
        res.json(e)
    }
}

module.exports = userCltr
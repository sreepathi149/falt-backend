const User = require('../models/user-model')
const Employee = require('../models/employee-model')
const bcrypt = require('bcryptjs')
const pick = require('lodash/pick')
const jwt = require('jsonwebtoken')
const otp = require('otp-generator')
const Company = require('../models/company-model')
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
const validator = require('validator')
const nodemailer = require('nodemailer')
const { v4: uuidv4 } = require('uuid')
const sendMail = require('../helpers/send-mail')
const sendOtp = require('../helpers/twilio')
uuidv4()

const loginCltr = {}

loginCltr.login = async (req, res) => {
    try {
        const body = pick(req.body, ['email', 'mobile', 'password'])
        const user = await User.findOne({email: body.email}) // how to check sign in with mobile or password
        const employee = await Employee.findOne({email: body.email}) // how to check sign in with mobile or password
        if(user){
            const password = await bcrypt.compare(body.password, user.password) 
            if(password) {
                const company = await Company.findOne({owner: user._id})
                const sendOtp = otp.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
                const userDoc = await User.findByIdAndUpdate(user._id, {otp: sendOtp}, {runValidators: true, new: true})
                const message = await client.messages
                .create({
                    body: `OTP for Verification - ${sendOtp}`,
                    from: process.env.TWILIO_NUMBER,
                    to: `+91${user.mobile}`
                })
                console.log('Otp send Successfully')
                //sendOtp(sendOtp, user.mobile) 
                const tokenData = {
                    id: user._id,
                    company: company._id,
                    role: user.role
                } 
                const token = jwt.sign(tokenData, process.env.JWT_SECRET)
                //console.log(user, 'user')
                res.json({
                    token:`bearer ${token}`
                })
            } else {
                res.json({error: 'invalid email/password-userp'})
            }
        } else if(employee) {
            console.log(body.password)
            const password = await bcrypt.compare(body.password, employee.password)
            if(password) {
                const sendOtp = otp.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
                console.log(sendOtp)
                const employeeDoc = await Employee.findByIdAndUpdate(employee._id, {otp: sendOtp}, {runValidators: true, new: true})
                const message = await client.messages
                .create({
                    body: `OTP for Verification - ${sendOtp}`,
                    from: process.env.TWILIO_NUMBER,
                    to: `+${employee.mobile}`
                })
                console.log('Otp send Successfully')
                //sendOtp(otp, employee.mobile)
                const tokenData = {
                    id: employee._id, 
                    role: employee.role,
                    company: employee.company
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET)
                res.json({
                    token: `bareWithMe ${token}`
                })
            } else {
                res.json({error: 'invalid password or email'})
            }
        } else {
            res.json({error: 'invalid email/password'})
        }
    } catch(e) {
        res.json(e)
    }
}

loginCltr.forgotPassword = async (req, res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email:email})
        const employee = await Employee.findOne({email: email})
        if(user) {
            const sendOtp = otp.generate(6, {upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false})
            const userDoc = await User.findByIdAndUpdate(user._id, {otp: sendOtp}, {runValidators: true, new: true})
            const message = await client.messages
                .create({
                    body: `OTP for Verification - ${sendOtp}`,
                    from: process.env.TWILIO_NUMBER,
                    to: `+91${user.mobile}`
                })
            console.log('Otp send Successfully')
            //sendOtp(sendOtp, user.mobile)
            // let to = 'dk.karthikd9@gmail.com', subject = 'reset-password'
            // let link = `http://localhost:3000/forgot-password`, text = `please reset your password using below link \n ${link}`
            // sendMail(to, subject, text)              
            res.json(user)
        } else if(employee){
            const otp = otp.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
            const employeeDoc = await Employee.findByIdAndUpdate(employee._id, {otp: otp}, {runValidators: true, new: true})
            const message = await client.messages
                .create({
                    body: `OTP for Verification - ${sendOtp}`,
                    from: process.env.TWILIO_NUMBER,
                    to: `+91${user.mobile}`
                })
            console.log('Otp send Successfully')
            //sendOtp(otp, employee.mobile)
        } else {
            res.json("user not found")
        }      
    } catch(e) {
        res.json(e)
    }
}

loginCltr.verifyLogin = async (req, res) => {
    try {
        const body = req.body
        console.log(body)
        const user = await User.findOne({_id: req.user.id})
        const employee = await Employee.findOne({_id: req.user.id})
        if(user) {
            const company = await Company.findOne({_id: req.user.company})
            if(user.otp == body.otp) {
                console.log('otp is verified')
                res.json({
                    user: user,
                    company: company
                })        
            } else {
                res.json('invalid Otp, enter valid otp')
            }
        } else if(employee) {
            const company = await Company.findOne({_id: employee.company})
            if(employee.otp == body.otp) {
                console.log('otp is verified')
                res.json({
                    user: employee,
                    company: company
                })
            } else {
                res.json('invalid Otp, enter valid otp')
            }    
        } else {
            res.json('employee not found')
        }
    } catch(e) {
        res.json(e)
    }
}

loginCltr.resetPassword = async (req, res) => {
    try {
        const body = req.body
        const user = await User.findOne({_id: req.user.id}) // how to check sign in with mobile or password
        const employee = await Employee.findOne({_id: req.user.id}) // how to check sign in with mobile or password
        if(user){
            const password = await bcrypt.compare(body.oldPassword, user.password) 
            if(password) {
                if(validator.isStrongPassword(body.newPassword)){
                    const salt = await bcrypt.genSalt()
                    const hashedPassword = await bcrypt.hash(body.newPassword, salt)
                    const userDoc = await User.findByIdAndUpdate(user._id, {password: hashedPassword}, {runValidators: true, new: true})
                    res.json(userDoc)
                    console.log("password reset successed")
                } else { 
                    res.json("password is not strong enough")
                }
            } else {
                res.json("old password not matched")
            }
        } else if(employee) {
            const password = await bcrypt.compare(body.oldPassword, user.password) 
            if(password) {
                if(validator.isStrongPassword(body.newPassword)){
                    const salt = await bcrypt.genSalt()
                    const hashedPassword = await bcrypt.hash(body.newPassword, salt)
                    const employeeDoc = await Employee.findByIdAndUpdate(req.user.id, {password: hashedPassword}, {runValidators: true, new: true})
                    res.json(employeeDoc)
                } else { 
                    res.json("password is not strong enough")
                }
            } else {
                res.json("old password not matched")
            }
        } else {
            res.json('user not found')
        }
        
    } catch(e) {
        res.json(e)
    }
}

loginCltr.verifyOtpPassword = async (req, res) => {
    try {
        const body = req.body
        const user = await User.findOne({email: body.email}) // how to check sign in with mobile or password
        const employee = await Employee.findOne({email: body.email}) // how to check sign in with mobile or password
        if(user){
            if(user.otp == body.otp) {
                console.log('otp is verified')
                if(validator.isStrongPassword(body.newPassword)){
                    const salt = await bcrypt.genSalt()
                    const hashedPassword = await bcrypt.hash(body.newPassword, salt)
                    const userDoc = await User.findByIdAndUpdate(user._id, {password: hashedPassword}, {runValidators: true, new: true})
                    res.json(userDoc)
                    console.log("password reset successed")
                } else { 
                    res.json("password is not strong enough")
                }
            } else {
                res.json('invalid Otp, enter valid otp')
            }
        } else if(employee) {
            if(employee.otp == body.otp) {
                console.log('otp is verified')
                if(validator.isStrongPassword(body.newPassword)){
                    const salt = await bcrypt.genSalt()
                    const hashedPassword = await bcrypt.hash(body.newPassword, salt)
                    const employeeDoc = await Employee.findByIdAndUpdate(employee._id, {password: hashedPassword}, {runValidators: true, new: true})
                    res.json(employeeDoc)
                    console.log("password reset successed")
                } else { 
                    res.json("password is not strong enough")
                }
            } else {
                res.json('invalid Otp, enter valid otp')
            }
        } else {
            res.json('user not found')
        }
        
    } catch(e) {
        res.json(e)
    }
}


module.exports = loginCltr
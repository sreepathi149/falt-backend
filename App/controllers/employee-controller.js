const Employee = require('../models/employee-model')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const sendMail = require('../helpers/send-mail')

const employeeCltr = {}

employeeCltr.create = async (req, res) => {
    try {
        const body = req.body
        const endDate = new Date()
        if(validator.isStrongPassword(body.password)){
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(body.password, salt)
            const employee = new Employee(body)
            employee.password = hashedPassword
            employee.company = req.user.company
            employee.subscriptionEndDate = new Date(endDate.setDate(endDate.getDate() + 14))
            const employeeDoc = await employee.save()
            if(employeeDoc) {
                let to = employeeDoc.email, subject = 'Login Credentials'
                let text = `Welcome ${employeeDoc.name}
                Email:- ${employeeDoc.email}
                Password:- ${body.password}`
                
                sendMail(to, subject, text)
                res.json(employeeDoc)
            }
        } else {
            res.json('password is not strong password')
        }
    } catch(e) {
        res.json(e.message)
    }
}

employeeCltr.showEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('company')
        res.json(employees)
    } catch(e) {
        res.json(e)
    }
}

employeeCltr.showEmployee = async (req, res) => {
    try {
        const id = req.params.id
        const employee = await Employee.findById(id)
        res.json(employee)
    } catch(e) {
        res.json(e)
    }
}

employeeCltr.update = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const employee = await Employee.findByIdAndUpdate(id, {...body, company:req.user.company}, {runValidators: true, new: true})
        res.json(employee)
    } catch(e) {
        res.json(e)
    }
}

employeeCltr.remove = async (req, res) => {
    try {
        const id = req.params.id
        const employee = await Employee.findByIdAndDelete(id)
        res.json(employee)
    } catch(e) {
        res.json(e.message)
    }
}

employeeCltr.shareLocation = async (req, res) => {
    try {
        const id = req.user.id
        const body = req.body
        const employee = await Employee.findOneAndUpdate({_id: id}, { $push: { location: body } }, {runValidators: true, new: true})
        res.json(employee)
    } catch(e) {
        res.json(e.message)
    }
}

module.exports = employeeCltr
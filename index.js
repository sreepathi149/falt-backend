require('dotenv').config()
const express = require('express')
const cors = require('cors')
const configureDb = require('./configure/db')
const authenticateUser = require('./App/middlewares/authenticate-user')
const authorizeUser = require('./App/middlewares/authorize-user')
const userCltr = require('./App/controllers/user-controller')
const employeeCltr = require('./App/controllers/employee-controller')
const categoryCltr = require('./App/controllers/category-controller')
const clientCltr = require('./App/controllers/client-contrller')
const tasksCltr = require('./App/controllers/tasks-controller')
const companyCltr = require('./App/controllers/company-controller')
const upload = require('./App/middlewares/multer')
const verifyUser = require('./App/middlewares/verify-user')
const paymentsCltr = require('./App/controllers/payment-controller')
const loginCltr = require('./App/controllers/login-controller')

const app = express()
app.use(express.json({ extended: false }))
app.use(cors())
app.use(express.urlencoded({extended: false}))
configureDb()

const port = 4455

// <-------------------- Login ------------------->
app.post('/api/user/login', verifyUser, loginCltr.login)
app.post('/api/user/verify-login', authenticateUser, loginCltr.verifyLogin)
app.put('/api/user/reset-password', authenticateUser, loginCltr.resetPassword)
app.put('/api/user/forgot-password',  loginCltr.forgotPassword)
app.put('/api/user/verify-otp-password',  loginCltr.verifyOtpPassword)

// <------------------- admin --------------------->
app.post('/api/user/register', userCltr.register)
app.get('/api/user/account', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorizeUser, userCltr.account)
app.put('/api/user/update', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorizeUser, userCltr.update)
app.get('/api/user/company', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, userCltr.company)
app.put('/api/user/update-company-details', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorizeUser, userCltr.updateCompanyDetails)

// <------------------- company --------------------->

app.get('/api/company', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, companyCltr.showCompany)

// <------------------- employee ------------------->
app.post('/api/employee/create', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorizeUser, employeeCltr.create)
app.get('/api/employees', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, employeeCltr.showEmployees)
app.get('/api/employee/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, employeeCltr.showEmployee)
app.put('/api/employee-update/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager']
    next()
}, authorizeUser, employeeCltr.update)
app.put('/api/employee-share-location', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, employeeCltr.shareLocation)
app.delete('/api/employee-delete/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorizeUser, employeeCltr.remove)


//<-------------------- category ----------------------->
app.post('/api/category/create', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorizeUser, categoryCltr.create)
app.get('/api/categories', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, categoryCltr.showCategories)
app.get('/api/category/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, categoryCltr.showCategory)
app.put('/api/category-update/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, categoryCltr.update)
app.delete('/api/category-delete/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorizeUser, categoryCltr.remove)


// <----------------- client ------------------->
app.post('/api/client/register', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorizeUser, clientCltr.create)
app.get('/api/clients', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, clientCltr.showClients)
app.get('/api/client/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin','manager', 'fieldAgent']
    next()
}, authorizeUser, clientCltr.showClient)
app.get('/api/client/account', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin','manager', 'fieldAgent']
    next()
}, authorizeUser, clientCltr.account)
app.put('/api/client-update/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin','manager']
    next()
}, authorizeUser, clientCltr.update)
app.delete('/api/client-delete/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin']
    next()
}, authorizeUser, clientCltr.remove)




// <--------------------------- tasks ------------------------->
app.post('/api/tasks/create', upload.array('fieldStatus', 5), authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager']
    next()
}, authorizeUser, tasksCltr.create)
app.get('/api/tasks', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, tasksCltr.showTasks)
app.get('/api/tasks/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, tasksCltr.showTask)
app.put('/api/tasks-update/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager']
    next()
}, authorizeUser, tasksCltr.update)
app.put('/api/tasks-uploads/:id', upload.array('fieldStatus', 5), authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager', 'fieldAgent']
    next()
}, authorizeUser, tasksCltr.uploads)
app.delete('/api/tasks-delete/:id', authenticateUser, (req, res, next) => {
    req.permittedRoles = ['admin', 'manager']
    next()
}, authorizeUser, tasksCltr.remove)


// <------------------------ payment ------------------->
app.post('/api/user/payment', paymentsCltr.checkOut)


app.listen(port, () => {
    console.log('server connected to port', port)
})
const Client = require('../models/client-model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const validator = require('validator')
const otp = require('otp-generator')
const axios = require('axios')
const sendMail = require('../helpers/send-mail')
const twilio = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)
const clientCltr = {}

clientCltr.create = async (req, res) => {
    try {
        const body = req.body
        let address = `${body.address.place} ${body.address.city} ${body.address.state}`
        if(validator.isStrongPassword(body.password)) {
            const response = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.LOCATION_IQ}&q=${address}&format=json`)
            console.log(response.data)
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(body.password, salt)
            const client = new Client(body)
            client.password = hashedPassword
            client.company = req.user.company
            client.location.latitude = response.data[0].lat
            client.location.longitude = response.data[0].lon
            const clientDoc = await client.save() 
            console.log(clientDoc, "hi")  
            if(clientDoc){
                let to = clientDoc.email, subject = 'reset-password', text = `your password for login is - ${body.password}`
                sendMail(to, subject, text) 
                res.json(clientDoc)
            } 
        } else {
            res.json('password is not strong enough')
        }
    } catch(e) {
        res.json(e)
    }
}

clientCltr.login = async (req, res) => {
    try {
        const body = req.body
        const client = await Client.finOne({email: body.email})
        if(client){
            const password = await bcrypt.compare(body.password, client.password)
            if(password) {
                const otp = otp.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
                const client = await Client.findByIdAndUpdate(client._id, {otp: otp}, {runValidators: true, new: true})
                const messages = await twilio.messages.create({
                    from: process.env.TWILIO_NUMBER,
                    to: client.mobile,
                    body: `otp for login - ${otp}`
                })
                const tokenData = {
                    id: client._id, 
                    role: client.role
                }
                const token = jwt.sign(tokenData, process.env.JWT_SECRET)
                res.json({
                    token: `bareWithMe ${token}`
                })
            } else {
                res.json({error: 'invalid password or email'})
            }
        } else {
            res.json({error: 'invalid password or email'})
        }
    } catch(e) {
        res.json(e)
    }
}

clientCltr.verifyLogin = async (req, res) => {
    try {
        const body = req.body
        const client = await Client.findById(req.user.id)
        if(client.otp == body.otp){
            res.json(client)
        } else {
            res.json({error: 'invalid otp - enter valid otp'})
        }
    } catch(e) {
        res.json(e)
    }
}

clientCltr.showClients = async (req, res) => {
    try {
        const clients = await Client.find({company: req.user.company}).populate('company')
        res.json(clients)
    } catch(e) {
        res.json(e)
    }
}

clientCltr.showClient = async (req, res) => {
    try {
        const id = req.params.id
        const client = await Client.findById(id)
        res.json(client)
    } catch(e) {
        res.json(e)
    }
}

clientCltr.update = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const client = await Client.findByIdAndUpdate(id, {...body, company:req.user.company}, {runValidators: true, new: true})
        res.json(client)
    } catch(e) {
        res.json(e)
    }
}

clientCltr.remove = async (req, res) => {
    try {
        const id = req.params.id
        const client = await Client.findByIdAndDelete(id)
        res.json(client)
    } catch(e) {
        res.json(e)
    }
}

clientCltr.resetPassword = async (req, res) => {
    try {
        const body = req.body
        if(validator.isStrongPassword(body.password)){
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(body.password, salt)
            const client = await Client.findByIdAndUpdate(req.user.id, {password: hashedPassword}, {runValidators: true, new: true})
            res.json(client)
        } else { 
            res.json("password is not strong enough")
        }
    } catch(e) {
        res.json(e)
    }
}

clientCltr.forgotPassword = async (req, res) => {
    try {
        const {email, password} = req.body
        if(validator.isStrongPassword(password)){
            const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password, salt)
            const client = await Client.findOneAndUpdate({email:email}, {password: hashedPassword},{runValidators: true, new: true})
            res.json(client)
        } else { 
            res.json("password is not strong enough")
        }
    } catch(e) {
        res.json(e)
    }
}

clientCltr.account = async (req, res) => {
    try{
        const client = await Clientlient.findById(req.user.id)
        res.json(client)
    } catch(e) {
        res.json(e)
    }
}


module.exports = clientCltr



/*
https://us1.locationiq.com/v1/search?key=pk.dd489f4b8291b717fc6fed34faef4dd8&q=221b%2C%20Baker%20St%2C%20London%20&format=json
*/

/*
https://us1.locationiq.com/v1/directions/driving/-0.12070277,51.514156;-0.12360937,51.507996?key=<Your_API_Access_Token>&steps=true&alternatives=true&geometries=polyline&overview=full

*/

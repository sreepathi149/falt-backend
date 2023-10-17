const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)

const textMessage = async (otp, mobile) => {
    const message = await client.messages
    .create({
        body: `OTP for Verification - ${otp}`,
        from: process.env.TWILIO_NUMBER,
        to: `+91${mobile}`
    })
    console.log('Otp send Successfully')
} 

module.exports = textMessage
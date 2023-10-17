const nodemailer = require('nodemailer')

const sendMail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        //   host: "smtp.ethereal.email",
        //   port: 587,
            service:'hotmail',
            auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
            },
        })
        try {
            // send mail with defined transport object
            
            const info = await transporter.sendMail({
                from: process.env.Email, 
                to: to,
                subject: subject,
                text:text,
            })
            console.log("Message sent: %s", info.messageId);
        } catch(e) {
            console.log(e)
        }             
}

module.exports = sendMail
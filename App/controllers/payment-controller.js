const crypto = require('crypto')
const Payment = require('../models/payment-model')
const User = require('../models/user-model')
const Employee = require('../models/employee-model')
const stripe=require('stripe')(process.env.SECRET_KEY_STRIPE)

const paymentsCltr = {}

paymentsCltr.checkOut = async (req,res)=>{
    try{
        const body=req.body
        console.log(body)
        const lineitems = body.map((ele)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:ele.day+'days'
                },
                unit_amount:ele.amount * 100
            },
            quantity:1
        }))
        console.log(lineitems,'line')
        const session= await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:lineitems,
            mode:'payment',
            success_url: 'http://localhost:3000/pricing',
            cancel_url: 'http://localhost:3000/pricing'
        })
        console.log(session)
        res.json({
            url:session.url
        })
    }
    catch(err){
        res.json(err.message)
    }
}

module.exports = paymentsCltr
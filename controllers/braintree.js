const User = require('../models/users-schema');
const braintree = require('braintree');
require('dotenv').config()

const gateWay = braintree.connect({
   environment: braintree.Environment.Sandbox,
   merchantId: process.env.BRAINTREE_MERCHANT_ID,
   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
   privateKey: process.env.BRAINTREE_PRIVATE_KEY
   
})

exports.generateToken = (req, res) => {
    gateWay.clientToken.generate({} , function(err , response){
        if(err){
            res.status(500).send(err)
        }else{
            res.send(response);
        }
    })
} 

exports.processPayment = (req, res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    let newTransaction = gateWay.transaction.sale(
        {
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        },
        (error, result) => {
            if (error) {
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        }
    );
};
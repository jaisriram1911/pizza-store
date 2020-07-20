const User = require('../models/users-schema');  
const { Order } = require('../models/order-schema')

exports.userById = (req, res ,next ,_id) =>{
    User.findById(_id).exec((err ,user)=>{
        if(err || !user){
            return res.status(400).json({
                error: 'user not found'
            });
        }
        req.profile = user;
        next();
    })
}  

exports.read = (req, res) =>{
    req.profile.hased_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}

exports.update = (req , res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true},
        (err , user)=>{
            if(err){
                return res.status(400).json({
                    error: 'you are not authorized to perform this action'
                })
            }
            user.hased_password = undefined;
            user.salt = undefined;
            res.json(user)
        }
        )
}

exports.addOrderToUserHistory = (req, res , next ) => {
    let history = []

    req.body.order.products.forEach((item) => {
        history.push({
            _id: item._id,
            name: item.name,
            quantity: item.count,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        })
    })

    User.findOneAndUpdate({_id: req.profile._id} , 
        {$push: {history: history}} , 
        {new: true} , (error , data) =>{
            if(error){
                return res.status(400).json({
                    error: 'could not update user purchase history'
                })
            }
            next();
    })
}

exports.purchaseHistory = (req , res) =>{
    Order.find({user: req.profile._id})
    .populate('user' , '_id name')
    .sort('-created')
    .exec((err , orders) => {
        if(err){
            return res.status(400).json({
                error: 'could not view purchase history'
            })
        }
        res.json(orders);
    } )
}

exports.updateOrderStatus = ( req , res ) => {
    Order.update({_id: req.body.orderId} , 
        {$set: {status: req.body.status}},
        (err , order) =>{
            if(err){
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }
            res.json(order);
        }
        )
}

exports.getStatusValues = (req , res) =>{
    res.json(Order.schema.path('status').enumValues)
}
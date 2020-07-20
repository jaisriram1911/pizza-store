const express = require('express');
const router = express.Router();

const { requireSignin , isAuth , isAdmin } = require('../controllers/auth')
const { userById , read , update  ,purchaseHistory , updateOrderStatus , getStatusValues} = require('../controllers/user-controller')

router.get('/secret/:userId' , requireSignin , isAuth , isAdmin , (req, res)=>{
    res.json({
        user: req.profile
    });
});

router.put('/order/:orderId/status/:userId' , requireSignin , isAuth , updateOrderStatus)

router.get('/order/status-values/:userId' , requireSignin , isAuth , getStatusValues)
router.get('/user/:userId' , requireSignin , isAuth , read)
router.put('/user/:userId' ,requireSignin , isAuth , update )
router.get('/orders/by/user/:userId' , requireSignin , isAuth , purchaseHistory)

router.param('userId' , userById);

module.exports=router;  
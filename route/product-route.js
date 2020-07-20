const express = require('express');
const router = express.Router();

const { requireSignin , isAuth , isAdmin } = require('../controllers/auth')
const {photo, create ,productById , read ,remove , update , list , listRelated , listCategories, listBySearch} = require('../controllers/product-controller');
const { userById } = require('../controllers/user-controller');

router.get("/category/:product", read);
router.get('/products' , list)
router.get('/products/related/:productId' , listRelated)
router.get('/products/categories' , listCategories)
router.get('/products/photo/:productId' , photo)

router.post('/products/by/search' , listBySearch)
router.post('/product/create/:userId', requireSignin, isAdmin , isAuth, create);

router.put('/product/:productId/:userId' , requireSignin, isAdmin , isAuth , update )  

router.delete('/product/:productId/:userId' ,requireSignin, isAdmin , isAuth ,remove )

router.param('userId' , userById);
router.param('productId' , productById);

module.exports = router; 
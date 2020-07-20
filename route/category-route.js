const express = require('express');
const router = express.Router();

const { requireSignin , isAuth , isAdmin } = require('../controllers/auth')
const { create , categoryById , read , remove , update , list} = require('../controllers/category-controller');
const { userById } = require('../controllers/user-controller')

router.post('/category/create/:userId', requireSignin, isAdmin , isAuth, create);
router.get('/category/:categoryId' , read)
router.put('/category/:categoryId/:userId', requireSignin, isAdmin , isAuth, update);
router.delete('/category/:categoryId/:userId', requireSignin, isAdmin , isAuth, remove);
router.get('/categories' , list)

router.param('categoryId' , categoryById);
router.param('userId' , userById);

module.exports = router;  
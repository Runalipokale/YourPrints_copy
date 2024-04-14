const express = require('express');

const authController = require('../controller/authController');

const router = express.Router();

router.get('/login',authController.getLogin);

router.post('/login',authController.postLogin);

router.get('/user/signUp',authController.getSignUp);

router.post('/user/signUp',authController.postSignUp);

router.get('/profile',authController.getUserProfile);


module.exports = router;
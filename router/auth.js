import express from 'express';

import * as authController from '../controller/authController.js';

const router = express.Router();

router.get('/login',authController.getLogin);

router.post('/login',authController.postLogin);

router.get('/user/signUp',authController.getSignUp);

router.post('/user/signUp',authController.postSignUp);

router.get('/profile',authController.getUserProfile);

router.get('/logout',authController.postlogOut);

router.post('/logout',authController.postlogOut);


export default router;
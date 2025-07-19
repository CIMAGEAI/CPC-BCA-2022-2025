const express=require('express');
const userRouter=express.Router();
const { makeJWT } = require('../middlewares/user.middleware');
const {login,signUp,getUserDetails,sendOTP, verifyOTP,getAllUsers, logout}=require('../controllers/user.controller');

userRouter.post('/sendOTP',sendOTP);
userRouter.post('/verifyOTP',verifyOTP);
userRouter.get('/all', makeJWT,getAllUsers);
userRouter.post('/login',login);
userRouter.get('/logout',logout);
userRouter.post('/signUp',signUp);
userRouter.get('/getUserDetails',makeJWT,getUserDetails);

module.exports={userRouter};
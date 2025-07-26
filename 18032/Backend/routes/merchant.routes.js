const express=require('express');
const merchantRouter=express.Router();
const {merchantPayment, getMerchantTransactionHistoryOfUser}=require('../controllers/merchantTransaction.controller');
const { makeJWT } = require('../middlewares/user.middleware');

merchantRouter.post('/makeMerchantPayment',makeJWT,merchantPayment);
merchantRouter.get('/getMerchantTransactionHistoryOfUser',makeJWT,getMerchantTransactionHistoryOfUser);

module.exports={merchantRouter};
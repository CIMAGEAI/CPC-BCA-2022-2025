const express=require('express');
const transactionRouter=express.Router();
const {makePayment,getPaymentHistoryOfUser,benchmarkTransactionHistory,checkBalance,changeTransactionPIN,getFullTransactionHistory}=require('../controllers/transaction.controller');
const { makeJWT } = require('../middlewares/user.middleware');

transactionRouter.post('/makePayment',makeJWT,makePayment);
transactionRouter.get('/getPaymentHistoryOfUser',makeJWT,getPaymentHistoryOfUser);
transactionRouter.get('/getFullTransactionHistory',makeJWT,getFullTransactionHistory);
transactionRouter.post('/changeTransactionPIN',makeJWT,changeTransactionPIN);
transactionRouter.get('/checkBalance',checkBalance);

module.exports={transactionRouter};
const pool=require('../config/db-config');
const bcrypt=require('bcrypt');
const crypto=require('crypto');

function generateTransactionId(length = 10) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

async function getMerchantTransactionHistoryOfUser(req, res) {
    try {
        const upa = req.query.upa;
        if (!upa) {
            return res.status(400).json({ message: 'Missing UPA' });
        }
        const client = await pool.connect();
        const result = await client.query(
            `SELECT * FROM merchantTransactionDetails
            WHERE customerUPA=$1`,
            [upa]
        );
        client.release();
        return res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });    }
}



async function merchantPayment(req, res) {
    try {
        const data = req.body;
        const client = await pool.connect();
        await client.query('BEGIN');

        const result1 = await client.query(
            `SELECT transactionPIN, accountBalance FROM userDetails WHERE uniquePaymentAddress=$1`,
            [data.customerUPA]
        );
        if (!result1.rows[0]) {
            await client.query('ROLLBACK');
            client.release();
            return res.status(404).json({ message: 'User not found' });
        }
        const { transactionpin, accountbalance } = result1.rows[0];
        const isCorrectPIN = await bcrypt.compare(data.transactionPIN, transactionpin);
        if (!isCorrectPIN) {
            await client.query('ROLLBACK');
            client.release();
            return res.status(401).json({ message: 'Invalid PIN' });
        }
        if (accountbalance < data.amount) {
            await client.query('ROLLBACK');
            client.release();
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        const newCustomerBalance = accountbalance - data.amount;
        await client.query(
            `UPDATE userDetails SET accountBalance=$1 WHERE uniquePaymentAddress=$2`,
            [newCustomerBalance, data.customerUPA]
        );
        const transactionID = generateTransactionId(10); 
        const insertResult = await client.query(
            `INSERT INTO merchantTransactionDetails(transactionID,customerUPA, merchantUPA, amount, serviceType, metadata)
             VALUES($1, $2, $3, $4, $5,$6) RETURNING *`,
            [
                transactionID,
                data.customerUPA,
                data.merchantUPA,
                data.amount,
                data.serviceType,
                data.metadata
            ]
        );

        await client.query(
            `INSERT INTO transactionHistory(transactionID, amount, senderID, receiverID, transactionType)
             VALUES($1, $2, $3, $4, $5)`,
            [
                transactionID,
                data.amount,
                data.customerUPA,
                data.merchantUPA,
                'merchant'
            ]
        );

        await client.query('COMMIT');
        client.release();
        return res.status(201).json({
            message: 'Transaction successfull',
            senderBalance: newCustomerBalance,
            transactionDetails: insertResult.rows[0],
        });
    } catch (error) {
        console.log('error:',error.message);
        return res.status(500).json({
            message: 'Something went wrong',
            error: error.message,
        });
    }
}

module.exports={
  merchantPayment,
  getMerchantTransactionHistoryOfUser
};
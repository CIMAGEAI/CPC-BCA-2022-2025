const bcrypt=require('bcrypt');
const pool = require('../config/db-config');
const axios=require('axios')
const crypto = require('crypto');

function generateTransactionId(length = 10) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

async function makePayment(request,response) {
    let clientDB;
    try {
        const client = request.body;
        console.log("Request body:", client);
        clientDB = await pool.connect();

        await clientDB.query('BEGIN');

        const result1 = await clientDB.query(`
            SELECT transactionPIN,accountBalance FROM userDetails 
            WHERE uniquePaymentAddress=$1
        `, [client.senderID]);

        const { transactionpin, accountbalance } = result1.rows[0];
        console.log("result1:", result1.rows[0]);
        const isMatch = await bcrypt.compare(client.transactionPIN, transactionpin);
        if (!isMatch) {
            await clientDB.query('ROLLBACK');
            clientDB.release();
            console.log("Incorrect PIN");
            return response.status(401).json({
                message: "Incorrect PIN",
                status: 401
            });
        }
        if (accountbalance < client.amount) {
            await clientDB.query('ROLLBACK');
            clientDB.release();
            console.log("Insufficient balance");
            return response.status(400).json({
                message: "Insufficient balance",
                status: 400
            });
        }

        const transactionID = generateTransactionId(10);
        const values = [
            transactionID,
            client.amount,
            client.senderID,
            client.receiverID,
        ];
        const newSenderBalance = accountbalance - client.amount;
        const senderDetailsNew = await clientDB.query(`
            UPDATE userDetails 
            SET accountbalance=$1
            WHERE uniquePaymentAddress=$2
            RETURNING accountbalance
        `, [newSenderBalance, client.senderID]);
        console.log("newSenderbalance:", senderDetailsNew.rows[0].accountbalance);

        const result2 = await clientDB.query(`
            SELECT accountBalance FROM userDetails
            WHERE uniquePaymentAddress=$1
        `, [client.receiverID]);

        const receiverOldBalance = result2.rows[0].accountbalance;
        const newReceiverBalance = receiverOldBalance + client.amount;
        const receiverDetailsNew = await clientDB.query(`
            UPDATE userDetails
            SET accountbalance=$1
            WHERE uniquePaymentAddress=$2
            RETURNING accountbalance
        `, [newReceiverBalance, client.receiverID]);
        console.log("receiverDetailsNew Receiver balance:", receiverDetailsNew.rows[0].accountbalance);

        const transactionQueryResult = await clientDB.query(`
            INSERT INTO userTransactionDetails(transactionID,amount,senderID,receiverID)
            VALUES($1,$2,$3,$4) RETURNING *
        `, values);
        const transactionHistoryQueryResult = await clientDB.query(`
            INSERT INTO transactionHistory(transactionID,amount,senderID,receiverID,transactionType)
            VALUES($1,$2,$3,$4,$5) RETURNING *`,
            [
                transactionID,
                client.amount,
                client.senderID,
                client.receiverID,
                'p2p'
            ]
        );

        await clientDB.query('COMMIT');
        clientDB.release();
        console.log({
            message: "Transaction successfull",
            senderBalance: senderDetailsNew.rows[0].accountbalance,
            receiverBalance: receiverDetailsNew.rows[0].accountbalance,
            transactionDetails: transactionQueryResult.rows[0]
        });
        return response.status(200).json({
            message: "Transaction successfull",
            senderBalance: senderDetailsNew.rows[0].accountbalance,
            receiverBalance: receiverDetailsNew.rows[0].accountbalance,
            transactionDetails: transactionQueryResult.rows[0]
        });
    } catch (error) {
        if (clientDB) {
            try { await clientDB.query('ROLLBACK'); } catch (e) {}
            try { clientDB.release(); } catch (e) {}
        }
        console.error("Server error in makePayment:", error);
        return response.status(500).json({ message: "Server error", error: error.message });
    }
}

async function getFullTransactionHistory(req, res) {
    try {
        const upa = req.query.upa;
        if (!upa) {
            console.log("No UPA provided in query.");
            return res.status(400).json({ error: "Missing UPA in query parameters." });
        }

        const result = await pool.query(`
            SELECT * FROM transactionHistory
            WHERE senderID=$1 OR receiverID=$1
            ORDER BY transactionTime DESC;
        `, [upa]);
        console.log(`Fetched ${result.rowCount} transactions for UPA: ${upa}`);

        let transactionHistory = [];

        for (let i = 0; i < result.rowCount; i++) {
            const row = result.rows[i];
            const otherUpa = row.senderid === upa ? row.receiverid : row.senderid;
            let name = 'Unknown';

            try {
                const userResult = await pool.query(
                    'SELECT name FROM userDetails WHERE uniquePaymentAddress=$1',
                    [otherUpa]
                );
                if (userResult.rows.length && userResult.rows[0].name) {
                    name = userResult.rows[0].name;
                } else {
                    // If not found, try merchantTransactionDetails for metadata.company
                    const merchantResult = await pool.query(
                        'SELECT metadata FROM merchantTransactionDetails WHERE merchantUPA=$1 LIMIT 1',
                        [otherUpa]
                    );
                    if (
                        merchantResult.rows.length &&
                        merchantResult.rows[0].metadata &&
                        merchantResult.rows[0].metadata.company
                    ) {
                        name = merchantResult.rows[0].metadata.company;
                    }
                }
            } catch (err) {
                console.log(`Failed to fetch name for UPA: ${otherUpa}`, err.message);
            }

            const isSent = row.senderid === upa;
            const amount = (isSent ? '-' : '+') + '₹' + Number(row.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });

            const dateObj = new Date(row.transactiontime);
            const date = [dateObj.getDate(), dateObj.toLocaleString('en-US', { month: 'short' })];
            const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            transactionHistory.push({
                name,
                amount,
                date,
                time,
                transactionId: row.transactionid || row.id || '-',
                transactionType: row.transactiontype || '-'
            });
        }
        return res.status(200).json(transactionHistory);
    } catch (error) {
        console.error("Error in getTransactionHistory:", error.message);
        return res.status(500).json({ error: "Failed to fetch transaction history", details: error.message });
    }
}

async function getPaymentHistoryOfUser(req, res) {
    try {
        const upa = req.query.upa;
        if (!upa) {
            console.log("No UPA provided in query.");
            return res.status(400).json({ error: "Missing UPA in query parameters." });
        }

        const result = await pool.query(`
            SELECT * FROM userTransactionDetails
            WHERE senderID=$1 or receiverID=$1
            ORDER BY transactiontime DESC;
        `, [upa]);
        console.log(`Fetched ${result.rowCount} transactions for UPA: ${upa}`);

        let transactionHistory = [];

        for (let i = 0; i < result.rowCount; i++) {
            const row = result.rows[i];
            const otherUpa = row.senderid === upa ? row.receiverid : row.senderid;
            let name = 'Unknown';

            try {
                // Try to find name in userDetails
                const userResult = await pool.query(
                    'SELECT name FROM userDetails WHERE uniquePaymentAddress=$1',
                    [otherUpa]
                );
                if (userResult.rows.length && userResult.rows[0].name) {
                    name = userResult.rows[0].name;
                } else {
                    // If not found, try merchantTransactionDetails for metadata.company
                    const merchantResult = await pool.query(
                        'SELECT metadata FROM merchantTransactionDetails WHERE merchantUPA=$1 LIMIT 1',
                        [otherUpa]
                    );
                    if (
                        merchantResult.rows.length &&
                        merchantResult.rows[0].metadata &&
                        merchantResult.rows[0].metadata.company
                    ) {
                        name = merchantResult.rows[0].metadata.company;
                    }
                }
            } catch (err) {
                console.log(`Failed to fetch name for UPA: ${otherUpa}`, err.message);
            }

            const isSent = row.senderid === upa;
            const amount = (isSent ? '-' : '+') + '₹' + Number(row.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });

            const dateObj = new Date(row.transactiontime);
            const date = [dateObj.getDate(), dateObj.toLocaleString('en-US', { month: 'short' })];
            const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

            transactionHistory.push({
                name,
                amount,
                date,
                time,
                transactionId: row.transactionid || row.id || '-',
            });
        }
        return res.status(200).json(transactionHistory);
    } catch (error) {
        console.error("Error in getPaymentHistoryOfUser:", error.message);
        return res.status(500).json({ error: "Failed to fetch payment history", details: error.message });
    }
}



async function checkBalance(req,res) {
  try {
    const user=req.query.upa;
    const checkBalanceStart=process.hrtime.bigint();
    const result=await pool.query(`
      SELECT name,accountBalance FROM userDetails
      WHERE uniquePaymentAddress=$1;
      `,[user]);
  
    const checkBalanceNs=Number(process.hrtime.bigint()-checkBalanceStart);
    const checkBalanceMs = Number(checkBalanceNs) / 1_000_000; // Convert nanoseconds to milliseconds
    console.log(`checkBalance Query took ${checkBalanceMs} ms`);
  
    return res.status(200).json({
      name:result.rows[0].name,
      currentBalance:result.rows[0].accountbalance,
    })
  } catch (error) {
    return res.status(500).json({message:"Something went error"})
  }
  
}

async function changeTransactionPIN(req, res) {
    try {
        const { upa, oldPIN, newPIN } = req.body;
        if (!upa || !oldPIN || !newPIN) {
            return res.status(400).json({ message: "Missing required fields (upa, oldPIN, newPIN)" });
        }

        // Fetch current PIN hash
        const result = await pool.query(
            `SELECT transactionPIN FROM userDetails WHERE uniquePaymentAddress=$1`,
            [upa]
        );
        if (!result.rows.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const currentHash = result.rows[0].transactionpin;
        const isMatch = await bcrypt.compare(oldPIN, currentHash);
        if (!isMatch) {
            return res.status(401).json({ message: "Old PIN is incorrect" });
        }

        // Hash new PIN and update
        const newHash = await bcrypt.hash(newPIN, 14);
        await pool.query(
            `UPDATE userDetails SET transactionPIN=$1 WHERE uniquePaymentAddress=$2`,
            [newHash, upa]
        );

        return res.status(200).json({ message: "Transaction PIN updated successfully" });
    } catch (error) {
        console.error("Error in changeTransactionPIN:", error.message);
        return res.status(500).json({ message: "Failed to change PIN", error: error.message });
    }
}

// Add to module.exports
module.exports = {
    makePayment,
    getPaymentHistoryOfUser,
    checkBalance,
    changeTransactionPIN,
    getFullTransactionHistory
};
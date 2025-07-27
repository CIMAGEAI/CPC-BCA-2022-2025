const pool=require('../config/db-config');
const bcrypt=require('bcrypt');
const {account,client}=require('../config/appwriteClient');
const {ID}=require("node-appwrite");
const jwt=require('jsonwebtoken');

let otpSessions={};
async function sendOTP(req,res) {
    console.log("sendOTP API hit");
    const {phoneNumber}=req.body;
    try {
        const token=await account.createPhoneToken(ID.unique(),phoneNumber);
        const userId=token.userId;
        otpSessions[phoneNumber]=userId;
        console.log("Token:",token);
        console.log("userId",userId);
        console.log("OTP sessions:",otpSessions);
        res.status(200).json({success:true,userId});
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.errors || error.message });
    }
}

async function verifyOTP(req,res) {
    console.log("verifyOTP API hit");
    const {phoneNumber,otp}=req.body;
    console.log(phoneNumber,":",otp);
    const userId=otpSessions[phoneNumber];
    try {
        const result=await account.createSession(userId,otp);
        delete otpSessions[phoneNumber];
        if(result)
        res.json({
            success: true,
            session: result, // includes Appwrite session token
            userId: result.userId,
        });
    } catch (error) {
        
    }
}

async function login(req, res) {
    console.log("LOGIN API HIT");
    const { phoneNumber, otp } = req.body;
    const mobileNumber=phoneNumber.slice(3);
    const userId = otpSessions[phoneNumber];
    if (!userId) {
        console.log("OTP session not found. Please request OTP again." );
        return res.status(400).json({ error: "OTP session not found. Please request OTP again." });
    }
    try {
        const result = await account.createSession(userId, otp);
        delete otpSessions[phoneNumber];
        if (result) {
            const userResult = await pool.query(
                `SELECT * FROM userDetails WHERE mobileNumber = $1`,
                [mobileNumber]
            );
            if (userResult.rows.length === 0) {
                console.log("User not found");
                return res.status(404).json({ error: "User not found" });
            }
            const userDetails = userResult.rows[0];

            // Generate JWT
            const jwtToken = jwt.sign(
                { userId: userDetails.userid, mobileNumber: userDetails.mobilenumber },
                process.env.JWT_SECRET
            );
            console.log({
                message: "Login successful",
                userId: userDetails.userid,
                jwt: jwtToken,
                userDetails,
                sessionId:result.$id
            });
            return res.status(200).json({
                message: "Login successful",
                userId: userDetails.userid,
                jwt: jwtToken,
                sessionId:result.$id,
                userDetails,
            });
        } else {
            console.log("OTP verification failed")
            return res.status(401).json({ error: "OTP verification failed" });
        }
    } catch (error) {
        console.log("error:",error);
        return res.status(500).json({ error: "Something went wrong" });
    }
}

async function logout(request,response){
    console.log("LOGOUT API HIT");
    const sessionId=req.sessionId;
    try {
        const result = await account.deleteSession(sessionId);
        return response.status(200).json({ success: true, result });
    } catch (error) {
        console.error("Error during logout:",error.message)
        return response.status(500).json({ success: false, error: error.message });
    }
}
async function signUp(request, response) {
    const user = request.body;
    const hashedPIN = await bcrypt.hash(user.transactionPIN, 14);

    // Use userId from backend mapping if possible, not from client (see previous suggestions)
    const values = [
        user.userId,
        user.name,
        user.mobileNumber,
        user.emailID,
        user.bankName,
        user.accountNumber,
        user.ifscCode,
        user.uniquePaymentAddress,
        user.accountBalance,
        hashedPIN
    ];

    try {
        const result = await pool.query(`
            INSERT INTO userDetails(userId, name, mobileNumber, emailID, bankName, accountNumber, ifscCode, uniquePaymentAddress, accountBalance, transactionPIN)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *;
        `, values);

        // Generate JWT
        const jwtToken = jwt.sign(
            { userId: user.userId, mobileNumber: user.mobileNumber },
            process.env.JWT_SECRET
        );

        response.status(201).json({
            message: "User registered successfully",
            userId: user.userId,
            jwt: jwtToken,
            userDetails: result.rows[0]
        });
    } catch (error) {
        console.log(error);
        response.status(501).json({
            error: "Something went wrong"
        });
    }
}

async function getUserDetails(req,res) {
    const {mobileNumber}=req.user;
    try {
        const result=await pool.query(`
            SELECT * FROM userDetails
            WHERE mobileNumber=$1
        `,[mobileNumber]);
        res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        response.status(501).json({
            error:"Something went wrong"
        })
    }   
}

async function getAllUsers(req, res) {
    try {
        const result = await pool.query(`SELECT * FROM userDetails`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

module.exports = { signUp, getUserDetails, sendOTP, verifyOTP, login,logout, getAllUsers };
import axios from 'axios';

async function getOTP(phoneNumber:string){
    const result=await axios.post('http://your-backend-url/user/sendOTP',{
        phoneNumber:`+91${phoneNumber}`
    });
}

async function verifyOTP(phoneNumber:string,otp:string) {
    const result=await axios.post('http://your-backend-url/user/verifyOTP',{
        phoneNumber:`+91${phoneNumber}`,
        otp
    })
    const userId=result.data.userId.userId;
    return {status:result.status,userId:userId};
}

async function login(phoneNumber: string, otp: string) {
    const result = await axios.post('http://your-backend-url/user/login', {
        phoneNumber: `+91${phoneNumber}`,
        otp
    });
    return {
        status: result.status,
        message: result.data.message,
        userId: result.data.userId,
        jwt: result.data.jwt,
        userDetails: result.data.userDetails,
        sessionId:result.data.sessionId
    };
}

async function logout(sessionId:string){
    const res=await axios.post('http://your-backend-url/user/logout',{sessionId});
    if(res.status===200){
        return res.data;
    }
    return false;
}

async function signUp(data: any) {
    const result = await axios.post('http://your-backend-url/user/signUp', data);
    return {
        status: result.status,
        message: result.data.message,
        userId: result.data.userId,
        jwt: result.data.jwt,
        userDetails: result.data.userDetails
    };
}
export { getOTP, login, logout, signUp, verifyOTP };


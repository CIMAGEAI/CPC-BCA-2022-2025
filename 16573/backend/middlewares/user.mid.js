import jwt from "jsonwebtoken"
import config from "../config.js";

function userMiddleware(req, res, next){
      
    const authHeader = req.headers.authorization;
    // console.log("authHeader = ",authHeader)

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error: "No token provided"});
    }
    const token = authHeader.split(" ")[1];
    // console.log("token = ",token)
    try{
        const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
        
        req.userId= decoded.id
        next();
        
    }catch(error){
        console.log("Cant go in try block")
        return res.status(401).json({errors: "Invalid token or expired"});
        
    }
}
export default userMiddleware;
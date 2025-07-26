const jwt = require('jsonwebtoken');

function makeJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); 
    } catch (error) {
        console.log('Invalid JWT');
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
}

module.exports = { makeJWT };
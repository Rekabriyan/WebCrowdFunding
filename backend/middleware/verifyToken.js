const jwt = require('jsonwebtoken');

const RefreshToken = require('../models/refreshToken');

function verifyToken(req, res, next){
    const token = req.header('auth-token');
    //.............................
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ status: 0, message: 'Invalid Token!'});
    }
}

async function verifyRefreshToken (req, res, next){
    const token = req.body.token;
    //.............................
    try {
        const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        req.user = verified;
        //verify if the token exist
        const storedRefreshToken = await RefreshTokenAdmin.findOne({ userId : verified._id});
        //.............................
        next();
    } catch (err) {
        res.status(401).json({ status: 0, message: 'Invalid Token!'});
    }
}

module.exports = { 
    verifyToken, 
    verifyRefreshToken 
};
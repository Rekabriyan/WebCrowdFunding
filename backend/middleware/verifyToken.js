const jwt = require('jsonwebtoken');

const RefreshTokenAdmin = require('../models/refreshTokenAdmin');

function verifyTokenAdmin(req, res, next){
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

async function verifyRefreshTokenAdmin (req, res, next){
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

module.exports = { verifyTokenAdmin, verifyRefreshTokenAdmin };
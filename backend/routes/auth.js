const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');

const { verifyToken, verifyRefreshToken } = require('../middleware/verifyToken');

router.post('/register', async (req, res) => {
    try{
        // Dapatkan data registrasi dari requrst body
        const { name, email, password } = req.body;

        //Buat User baru
        const newUser = new User({name, username, email, password});

        await newUser.save();

        return res.status(201).json({ status: 1, message: 'Registration Successfully!'});
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});

router.post('/login', async (req, res) => {
    // check username exists
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Invalid Username');

    // check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid Password');

    // create token
    const resfesh_token = jwt.sign({_id: user._id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME});
    generateREfreshToken(user.id, resfesh_token);
    return res.json({user, token, refresh_token});

});

async function generateREfreshToken(userId, refreshToken){

}

router.post('/token', verifyRefreshToken, async (req, res) => {
    const _id = req.user._id;
    const token = await jwt.sign({_id}, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME});
    const refresh_token  = await jwt.sign({_id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME});
    generateREfreshToken(_id, refresh_token);

    return res.json({token, refresh_token});
});

router.delete('/logout', verifyToken, async (req, res) => {
    try {
        res.clearCookie("jwt");
        const removeRefreshToken = awaitRefreshToken.deleteOne({ token: req.body.token});
        res.status(200).send({ status: 1, message: 'Logout Successfully'});
    } catch (err) {
        res.status(400).json({ status: 0, message: 'err'});
    }
});

module.exports = router;
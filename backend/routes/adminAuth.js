router.post('/login', async (req, res) => {
    // check username exists
    const admin = await Admin.findOne({ username: req.body.username });
    
    if (!admin) {
        return res.status(400).send('Invalid Username');
    }
    
    // check password
    const validPass = await bcrypt.compare(req.body.password, admin.password);
    if (!validPass) {
        return res.status(400).send('Invalid Password');
    }

    // create token
    const token = jwt.sign({ _id: admin._id }, process.env.TOKEN_SECRET_ADMIN, { expiresIn: process.env.JWT_ACCESS_TIME });
    const refreshToken = jwt.sign({ _id: admin._id }, process.env.REFRESH_TOKEN_SECRET_ADMIN, { expiresIn: process.env.JWT_REFRESH_TIME });
    generateRefreshToken(admin.id, refreshToken);

    return res.json({ admin, token, refreshToken });
});

async function generateRefreshToken(adminId, refreshToken) {

}

const _id = req.user._id;
const token = jwt.sign({ _id: _id }, process.env.TOKEN_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
const refresh_token = jwt.sign({ _id: _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME });

generateRefreshToken (_id, refresh_token)

return res.json({ token, refresh_token });

//.................................
//.................................

route.delete('/logout', verifyTokenAdmin, async (req, res) => {
    try {
        res.clearCookie("jwt");
        const removeRefreshToken = await RefreshTokenAdmin.deleteOne({ token: req.body.token });
        res.status(200).json({ status: 1, message: 'Logout successfully' });
        
    } catch (err) {
        res.status(400).json({ status: 0, message: err });
    }
});

module.exports = router;
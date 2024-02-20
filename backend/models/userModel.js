// models/userModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name: { type: String, required: true, },
    username: { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: false, },
    password: { type: String, required: true, },
});

userSchema.pre('save', async function(next) {
    // Encrypt password berfore saving
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
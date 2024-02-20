// models/adminModel.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const adminSchema = new Schema({
    username: { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: false, },
    password: { type: String, required: true, },
});

adminSchema.pre('save', async function(next) {
    // Encrypt password berfore saving
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
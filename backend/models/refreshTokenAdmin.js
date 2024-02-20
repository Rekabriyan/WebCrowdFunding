const mongoose = require('mongoose');

const RefreshTokenAdminSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    },
    token: {type: String, required: true},
    expire_token: { type: Date, required: true},
    date: { type:Date, default: Date.now},
})

module.exports = mongoose.model ('RefreshTokenAdmin', RefreshTokenAdminSchema);

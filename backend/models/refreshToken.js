const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },
    token: { type: String, required: true },
    expire_token: { type: Date, required: true },
    date: { type: Date, default: Date.now },

});
    
module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
// models/donationModel.js

const mongoose = require('mongoose');

const DonationSchema = mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
    donationId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, enum: ['open', 'pay', 'completed'], default: 'open' },
    paymentProof: { type: String },
    amount: { type: Number, required: true },
    createdDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Donation', DonationSchema);
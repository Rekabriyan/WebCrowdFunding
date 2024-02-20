// models/projectModel.js

const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    currentAmount: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Project', ProjectSchema);
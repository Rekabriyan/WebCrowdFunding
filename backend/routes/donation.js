const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Project = require('../models/projectModel');
const Donation = require('../models/donationModel');

const { verifyTokenAdmin } = require('../middleware/verifyToken');
const { verifyToken } = require('../middleware/verifyToken');
const User = require('../models/user');

// Konfigurasi penyimpanan untuk multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/payments'); // Menyimpan file di direktori uploads/
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Menyimpan file dengan timestamp yang unik
    },
});

const upload = multer({ storage: storage });

router.post('/guest/:id', async (req, res) =>{
    try {
        const projectId = req.params.id;
        const projectData = await Project.findOne({ _id: projectId });

        if(!projectData) {
            return res.status(400).json({ message: 'No Project Data'});
        }
        const donationId = "CF-" + generateCode();
        const {name, email, amount} = req.body;

        const donation = new Donation ({ projectId, donationId, name, email, amount});

        await donation.save();

        return res.json({ message: "Donation Completed", donateId: donationId});
    
    } catch (error){
        return res.status(400).json({ message: error});
    }
});

// Fungsi untuk menghasil kode berdasarkan timestamp 
function generateCode() {
    const timestamp = Date.now(); // Mendpatkan timestamp saat ini
    const code = timestamp.toString().substr(36).toUpperCase;

    return code;
} 

router.get('/payment-data/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const donationData = await Donation.findOne({ donationId: req.params.id });
        populate('projectId', 'name');

        if(!donationData) {
            return res.status(400).json({ message: 'No Donation Data'});
        }

        return res.json(donationData);
    
    } catch (error){
        return res.status(400).json({ message: error});
    }
});

router.get('/payment-data', verifyTokenAdmin, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded'});
    }

    // Dapatkan nama file yang diunggah
    const fileName = req.file.filename;

    try {
        const donationData = await Donation.findOne({ _id: req.params.id });

        if(!donationData) {
            return res.status(400).json({ message: 'No Donation Data'});
        }

        // Update Donation Data
        const updatedDataDonation = await Donation.updateOne({ _id: req.params.id }, { $set: { status: "pay", paymentProof: fileName } });

        return res.json({status: 1, message: "Payment Completed", data: updateDataDonation});

    } catch {
        return res.status(400).json({ message: error});
    }
});

router.post('/user/:id', verifyToken, async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user._id;

        const projectData = await Project.findOne({ _id: projectId });
        const userData = await User.findOne({ _id: userId });

        const name = userData.name;
        const email = userData.email;
        const amount = parseInt(req.body.amount);

        if(!projectData) {
            return res.status(400).json({ message: 'No Project Data'});
        }

        const donationId = "CF-" + generateCode();

        const donation = new Donation ({ projectId, userId, donationId, name, email, amount});
        
        await donation.save();

        return res,json({ message: "Donation Completed", donateId: donationId});
    
    } catch (error) {
        return res.status(400).json({ message: error});
    }
});

router.get('/user', verifyToken, async (req, res) => {
   const userId = req.user._id;

   try {
    const donations = await Donation.find({ userId: userId }).populate('projectId', 'name');

    return res.json(donations); 
   
    } catch (error) {
        return res.status(400).json({ message: error});
    }
});

router.get('/admin', verifyTokenAdmin, async (req, res) => {
    try {
        const donations = await Donation.find().populate('projectId', 'name').sort({ createdAt: -1 });

        return res.json(donations);
    
    } catch (error) {
        return res.status(400).json({ message: error});
    }
});

router.post('/payment-verification/:id', verifyTokenAdmin, async (req, res) => {
    try {
        const donationData = await Donation.findOne({ _id: req.params.id });

        if (!donationData.status != "pay") {
            return res.status(400).json({ message: 'No payment Data'});
        }
        const projectId = donationData.projectId;
        const projectData = await Project.findOne({ _id: projectId });
        // New Amount 
        const newAmount = parseInt(projectData.currentAmount) + parseInt(donationData.amount);

        if(!donationData){
            return res.status(400).json({ message: 'No Donation Data'});
        }

        // Update Date
        const now = new Date();

        // Update Data
        const updateDataDonation = await Donation.updateOne({ _id: req.params.id }, { $set: { currentAmount: newAmount } });

        return res.json({status: 1, message: "Update Completed", data: updateDataDonation});
        
    } catch (error) {
        return res.status(400).json({ message: error});
    }
});
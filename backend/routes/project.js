const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Project = require('../models/projectModel');
const Donation = require('../models/donationModel');

const { verifyTokenAdmin } = require('../middleware/verifyToken');

// Konfigurasi penyimpanan untuk multer
const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/project'); // Menyimpan file di direktori uploads/
        },
        filename: function(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, Date.now() + ext); // Menyimpan file dengan timestamp yang unik
        },
});

const upload = multer({ storage: storage});

router.get('/', async (req, res) => {
    try{
        const projectData = await Project.find().sort({ endDate: 1});

    return res.json(projectData);

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const projectData = await Project.findOne({ _id: req.params.id });
        
        return res.json(projectData);

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error});
    }
});

router.post('/add', verifyTokenAdmin, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded'});
    }

    // Dapatkan nama file yang diunggah
    const fileName = req.file.filename;

    try {
        const { name, description, startDate, endDate, targetAmount } = req.body;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        //Validasi : start_date tidak lebih dari end_date
        //.............

        //Validasi : end_date tidak kurang dari now
        //.............

        const project = new Project({
            name,
            description,
            image: fileName,
            targetAmount: targetAmount,
            startDate: start,
            endDate: end,
        });

        await project.save();

        return res.json({ status: 1, message: 'Project Uploaded'});
    } catch (error) {
        return res.status(400).json({ message: error});
    }
});

router.put('/update/:id', verifyTokenAdmin, upload.single('image'), async (req, res) => {
    try {
        const projectData = await Project.findOne({ _id: req.params.id });

        if (req.file) {
            // Hapus gambar lama dari server
            if (projectData.image){
                fs.unlinkSync(path.join(__dirname, '../uploads/project', projectData.image));
            }
            projectData.image = req.file.filename;
        }

        const { name, description, startDate, endDate, targetAmount } = req.body;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        //Validasi : start_date tidak lebih dari end_date
        //.............

        //Validasi : end_date tidak kurang dari now
        //.............

        // Update Data
        const updatedDataProduct = await Porject.updateOne({_id: req.params.id}, { $set: {name, description, startDate: start, endDate: end, targetAmount}});

        return res.json({message: 'Project Updated'});
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error});
    }
});


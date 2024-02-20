const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const Admin = require('./models/adminModel');
const adminMockData = require('./mockData/adminMockData');

const authAdminRoute = require('./routes/adminAuth');
const projectRoute = require('./routes/project');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// parse application/json
app.use(bodyParser.json());

const corsOptions = {
    origin: '*',
    methods:[
        'GET',
        'POST',
        'PUT',
        'DELETE'
    ],
    allowedHeaders: [
        'Content-Type', 'auth-token'
    ],
};

app.use(cors(corsOptions));

// Connection to MongoDB
mongoose.connect('mongodb://localhost:27017/crowdfunding-app', 
{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
});

const connection = mongoose.connextion;
connection.once('open', async () => {
    console.log('Connected to MongoDB');
    const adminCount = await Admin.estimatedDocumentCount();
    if (adminCount === 0) {
        try {
            // Add mock admin data to the database
            const {username, email, password} = adminMockData;

            const admin = new Admin({ username, email, password });
            await admin.save();

        } catch (error) {
            console.log('Admin data initialization error', error);
        }
    }
});

//Routes API
app.use('/admin/', authAdminRoute);
app.use('/user/', authRoute);
app.use('/project/', projectRoute);
app.use('/donation/', donationRoute);

//Static Folder
app.use(express.static('uploads'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
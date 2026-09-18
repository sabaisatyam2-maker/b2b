const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();

// Route files import kar rahe hain
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const listingRoutes = require('./routes/listingRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');

// Dotenv config load kar rahe hain taaki .env file se variables padh sakein


// Express app create kar rahe hain
const app = express();

// CORS middleware use kar rahe hain taaki frontend se requests aa sakein
app.use(cors());

// Express json middleware taaki request body JSON format mein parse ho sake
app.use(express.json());

// ==========================================
// Routes ko connect kar rahe hain
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Database connect kar rahe hain
connectDB();

// Test Route taaki browser mein check kar sakein server chal raha hai ya nahi
app.get('/', (req, res) => {
    res.send('API is running...');
});

// PORT variable set kar rahe hain, .env se value lega warna 5000 use karega
const PORT = process.env.PORT || 5000;

// Server start kar rahe hain
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

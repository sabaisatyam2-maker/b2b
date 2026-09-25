require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected for seeding...');

        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

        if (adminExists) {
            console.log('Admin already exists.');
            process.exit();
        }

        await User.create({
            name: process.env.ADMIN_NAME || 'Super Admin',
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            role: 'admin',
        });

        console.log(`Admin created successfully with email: ${process.env.ADMIN_EMAIL}`);
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();

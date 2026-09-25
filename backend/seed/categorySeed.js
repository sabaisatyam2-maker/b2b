require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categoriesToSeed = [
    "Website Development", 
    "E-commerce Development", 
    "AI Development", 
    "AI Chatbot", 
    "CRM", 
    "ERP", 
    "Cloud Solutions", 
    "SEO", 
    "Digital Marketing", 
    "Automation", 
    "Hosting", 
    "Maintenance", 
    "HR Services"
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Category Seeding...');

        for (const categoryName of categoriesToSeed) {
            const categoryExists = await Category.findOne({ name: categoryName });
            
            if (categoryExists) {
                console.log(`Category "${categoryName}" already exists. Skipping.`);
            } else {
                await Category.create({ name: categoryName });
                console.log(`Category "${categoryName}" created.`);
            }
        }

        console.log('Categories seeded successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedCategories();

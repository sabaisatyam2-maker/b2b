const mongoose = require('mongoose');
const VendorRequest = require('./models/VendorRequest');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Connected to MongoDB');
    const listings = await VendorRequest.find({ price: { $exists: false } });
    console.log(`Found ${listings.length} listings without price`);
    
    for (let listing of listings) {
        const randomPrice = Math.floor(Math.random() * 4500) + 500; // 500 to 4999
        listing.price = randomPrice;
        await listing.save();
    }
    
    console.log('Updated prices successfully');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});

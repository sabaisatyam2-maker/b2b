const VendorRequest = require('../models/VendorRequest');

// ==========================================
// 1. Get all public listings (Search & Filter)
// ==========================================
const getListings = async (req, res) => {
    try {
        const { keyword, category, location } = req.query;

        // Base query: Hamesha sirf 'approved' listings hi fetch karni hain
        const query = { status: 'approved' };

        // Agar user ne koi business name search kiya hai (keyword)
        if (keyword) {
            query.businessName = { $regex: keyword, $options: 'i' };
        }

        // Agar user ne kisi specific category ke liye filter lagaya hai
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        // Agar user ne koi specific location type ki hai
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        const listings = await VendorRequest.find(query);
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. Get a single listing by ID (Public)
// ==========================================
const getListingById = async (req, res) => {
    try {
        // ID se dhundo, lekin HAMESHA ye bhi check karo ki wo 'approved' ho
        const listing = await VendorRequest.findOne({ 
            _id: req.params.id, 
            status: 'approved' 
        }).populate('vendor', 'name'); // Optional: vendor ka sirf naam dikhane ke liye

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found or not approved yet' });
        }

        res.json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getListings,
    getListingById,
};

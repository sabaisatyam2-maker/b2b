const express = require('express');
const router = express.Router();

// Controllers import kar rahe hain
const { 
    createListing, 
    getMyListings, 
    updateListing, 
    deleteListing,
    getMyEnquiries
} = require('../controllers/vendorController');

// Middlewares import kar rahe hain
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const upload = require('../middleware/upload'); // Default export

// ==========================================
// Vendor Routes (All Protected & Authorized)
// ==========================================

// POST: Nayi listing create karne ke liye
router.post(
    '/listing', 
    protect, 
    authorize('vendor'), 
    upload.array('images', 5), 
    createListing
);

// GET: Sirf apni listings dekhne ke liye
router.get(
    '/my-listings', 
    protect, 
    authorize('vendor'), 
    getMyListings
);

// PUT: Apni listing update karne ke liye
router.put(
    '/listing/:id', 
    protect, 
    authorize('vendor'), 
    updateListing
);

// DELETE: Apni listing delete karne ke liye
router.delete(
    '/listing/:id', 
    protect, 
    authorize('vendor'), 
    deleteListing
);

// GET: Vendor apni sabhi enquiries dekh sake
router.get(
    '/enquiries', 
    protect, 
    authorize('vendor'), 
    getMyEnquiries
);

// Router export
module.exports = router;

const express = require('express');
const router = express.Router();

const { getListings, getListingById } = require('../controllers/listingController');

// ==========================================
// Public Listing Routes (Koi middleware nahi chahiye kyunki ye sabke liye open hain)
// ==========================================

// GET: Sabhi approved listings dekhne/search karne ke liye
router.get('/', getListings);

// GET: Kisi ek approved listing ki poori details dekhne ke liye
router.get('/:id', getListingById);

module.exports = router;

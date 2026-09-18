const express = require('express');
const router = express.Router();

const { createEnquiry } = require('../controllers/enquiryController');
const { protect } = require('../middleware/auth');

router.post('/:listingId', protect, createEnquiry);

module.exports = router;

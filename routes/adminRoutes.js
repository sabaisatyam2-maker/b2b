const express = require('express');
const router = express.Router();

const { 
    getPendingRequests, 
    getAllRequests, 
    approveRequest, 
    rejectRequest 
} = require('../controllers/adminController');

const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

// ==========================================
// Admin Routes (All routes require admin role)
// ==========================================

// GET: Sirf pending requests dekho
router.get('/requests/pending', protect, authorize('admin'), getPendingRequests);

// GET: Saari requests dekho (history ke liye)
router.get('/requests', protect, authorize('admin'), getAllRequests);

// PUT: Kisi request ko approve karo
router.put('/requests/:id/approve', protect, authorize('admin'), approveRequest);

// PUT: Kisi request ko reject karo (reason ke saath)
router.put('/requests/:id/reject', protect, authorize('admin'), rejectRequest);

module.exports = router;

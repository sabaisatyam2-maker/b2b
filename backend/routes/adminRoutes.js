const express = require('express');
const router = express.Router();

const { 
    getPendingRequests, 
    getAllRequests, 
    approveRequest, 
    rejectRequest,
    getAllCategories,
    addCategory,
    deleteCategory,
    getApprovedVendors,
    deleteListingByAdmin
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

router.get('/categories', protect, authorize('admin'), getAllCategories);
router.post('/categories', protect, authorize('admin'), addCategory);
router.delete('/categories/:id', protect, authorize('admin'), deleteCategory);

// GET: Sirf approved (live) vendors dekho
router.get('/vendors', protect, authorize('admin'), getApprovedVendors);

// DELETE: Kisi bhi vendor ki listing delete karo
router.delete('/listing/:id', protect, authorize('admin'), deleteListingByAdmin);

module.exports = router;

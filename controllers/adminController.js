const VendorRequest = require('../models/VendorRequest');
const Category = require('../models/Category');

// ==========================================
// 1. Get all 'pending' requests (Admin)
// ==========================================
const getPendingRequests = async (req, res) => {
    try {
        const requests = await VendorRequest.find({ status: 'pending' })
            .populate('vendor', 'name email phone');
            
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. Get ALL requests - pending, approved, rejected (Admin)
// ==========================================
const getAllRequests = async (req, res) => {
    try {
        const requests = await VendorRequest.find()
            .populate('vendor', 'name email phone');
            
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 3. Approve a Vendor Request (Admin)
// ==========================================
const approveRequest = async (req, res) => {
    try {
        const request = await VendorRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = 'approved';
        request.rejectionReason = ''; // Pehle ka reason clear kar do

        await request.save();
        res.json({ message: 'Vendor request approved successfully', request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 4. Reject a Vendor Request (Admin)
// ==========================================
const rejectRequest = async (req, res) => {
    try {
        const request = await VendorRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Agar admin ne body me koi reason nahi bheja, toh default message dalo
        const reason = req.body.reason || 'Not specified';

        request.status = 'rejected';
        request.rejectionReason = reason;

        await request.save();
        res.json({ message: 'Vendor request rejected', request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 5. Get all Categories (Admin)
// ==========================================
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 6. Add a Category (Admin)
// ==========================================
const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await Category.create({ name });
        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category already exists' });
        }
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 7. Delete a Category (Admin)
// ==========================================
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 8. Get Approved Vendors (Admin)
// ==========================================
const getApprovedVendors = async (req, res) => {
    try {
        const vendors = await VendorRequest.find({ status: 'approved' })
            .populate('vendor', 'name email phone')
            .sort({ createdAt: -1 });
            
        res.json(vendors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 9. Delete Any Listing (Admin)
// ==========================================
const deleteListingByAdmin = async (req, res) => {
    try {
        const listing = await VendorRequest.findById(req.params.id);
        
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        
        // No vendor ID check required here (Admin privileges)
        await listing.deleteOne();
        
        res.json({ message: 'Listing removed by admin' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPendingRequests,
    getAllRequests,
    approveRequest,
    rejectRequest,
    getAllCategories,
    addCategory,
    deleteCategory,
    getApprovedVendors,
    deleteListingByAdmin,
};

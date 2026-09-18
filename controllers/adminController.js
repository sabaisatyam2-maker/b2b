const VendorRequest = require('../models/VendorRequest');

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

module.exports = {
    getPendingRequests,
    getAllRequests,
    approveRequest,
    rejectRequest,
};

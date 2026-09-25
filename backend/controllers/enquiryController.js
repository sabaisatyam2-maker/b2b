const Enquiry = require('../models/Enquiry');
const VendorRequest = require('../models/VendorRequest');

const createEnquiry = async (req, res) => {
    try {
        const { listingId } = req.params;
        const { name, contact, message } = req.body;

        const listing = await VendorRequest.findOne({ 
            _id: listingId, 
            status: 'approved' 
        });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found or not approved' });
        }

        const enquiry = await Enquiry.create({
            user: req.user._id,
            vendorRequest: listingId,
            name,
            contact,
            message,
        });

        res.status(201).json(enquiry);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createEnquiry
};

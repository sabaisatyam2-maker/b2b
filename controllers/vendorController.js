const VendorRequest = require('../models/VendorRequest');
const Enquiry = require('../models/Enquiry');

// ==========================================
// 1. Create a new Listing (Vendor)
// ==========================================
const createListing = async (req, res) => {
    try {
        const { businessName, category, description, location, contactEmail, contactPhone } = req.body;

        // Multer se aayi hui images (array) ko process kar rahe hain
        const images = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach((file) => {
                images.push({
                    url: file.path,          // Cloudinary image URL
                    publicId: file.filename, // Cloudinary unique ID
                });
            });
        }

        const newListing = await VendorRequest.create({
            vendor: req.user._id, // Auth middleware se mila
            businessName,
            category,
            description,
            location,
            contactEmail,
            contactPhone,
            images,
            status: 'pending', // Explicitly setting it to pending
        });

        res.status(201).json(newListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 2. Get My Listings (Vendor)
// ==========================================
const getMyListings = async (req, res) => {
    try {
        // Sirf wahi listings dhundh rahe hain jinka vendor current user hai
        const listings = await VendorRequest.find({ vendor: req.user._id });
        res.json(listings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 3. Update Listing (Vendor)
// ==========================================
const updateListing = async (req, res) => {
    try {
        const listing = await VendorRequest.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // IMPORTANT SECURITY CHECK
        if (listing.vendor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to edit this listing' });
        }

        const { businessName, category, description, location, contactEmail, contactPhone } = req.body;

        if (businessName) listing.businessName = businessName;
        if (category) listing.category = category;
        if (description) listing.description = description;
        if (location) listing.location = location;
        if (contactEmail) listing.contactEmail = contactEmail;
        if (contactPhone) listing.contactPhone = contactPhone;

        // IMPORTANT: Details change hui hain toh wapas pending status me daal do
        listing.status = 'pending';

        await listing.save();
        res.json(listing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 4. Delete Listing (Vendor)
// ==========================================
const deleteListing = async (req, res) => {
    try {
        const listing = await VendorRequest.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // IMPORTANT SECURITY CHECK
        if (listing.vendor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this listing' });
        }

        await listing.deleteOne();
        res.json({ message: 'Listing deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// ==========================================
// 5. Get My Enquiries (Vendor)
// ==========================================
const getMyEnquiries = async (req, res) => {
    try {
        // Step 1: Is vendor ki saari listings dhundho aur sirf IDs nikaalo
        const listings = await VendorRequest.find({ vendor: req.user._id }).select('_id');
        const listingIds = listings.map(listing => listing._id);

        // Step 2: Un sabhi listing IDs par aayi hui enquiries dhundho
        const enquiries = await Enquiry.find({ vendorRequest: { $in: listingIds } })
            .populate('vendorRequest', 'businessName')
            .sort({ createdAt: -1 });

        res.json(enquiries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createListing,
    getMyListings,
    updateListing,
    deleteListing,
    getMyEnquiries,
};

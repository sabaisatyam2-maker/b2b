const mongoose = require('mongoose');

const vendorRequestSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Reference to User model
        },
        businessName: {
            type: String,
            required: [true, 'Please add a business name'],
        },
        category: {
            type: String, // Free text category
            required: [true, 'Please add a category'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        contactEmail: {
            type: String,
            required: [true, 'Please add a contact email'],
        },
        contactPhone: {
            type: String,
            required: [true, 'Please add a contact phone'],
        },
        images: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending', // Hamesha 'pending' se start hoga
        },
        rejectionReason: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true, // Automatically createdAt, updatedAt dega
    }
);

// Search fast karne ke liye in fields par ek Text Index create kar rahe hain
vendorRequestSchema.index({ businessName: 'text', category: 'text', location: 'text' });

const VendorRequest = mongoose.model('VendorRequest', vendorRequestSchema);

module.exports = VendorRequest;

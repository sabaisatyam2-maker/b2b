const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        vendorRequest: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'VendorRequest',
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        contact: {
            type: String,
            required: [true, 'Please add contact details'],
        },
        message: {
            type: String,
            required: [true, 'Please add a message'],
        },
        status: {
            type: String,
            enum: ['new', 'seen', 'responded'],
            default: 'new',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Enquiry', enquirySchema);

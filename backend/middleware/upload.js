const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// CloudinaryStorage define kar rahe hain ki file kahan aur kis format me save hogi
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'bizsphere/vendor-documents', // Cloudinary me is folder ke andar jayega
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'], // Sirf in formats ko allow karenge
    },
});

// Multer ko configure kar rahe hain with limits
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Maximum 5MB allow karenge (5 * 1024 KB * 1024 Bytes)
    },
});

module.exports = upload;

const jwt = require('jsonwebtoken');

// Ye function ek JWT token banayega jisme user ki 'id' aur 'role' encode honge
const generateToken = (id, role) => {
    return jwt.sign(
        { id, role }, // Payload
        process.env.JWT_SECRET, // Secret Key
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } // Expiry Time
    );
};

module.exports = generateToken;

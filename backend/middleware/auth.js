const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check karte hain ki request ke headers mein 'Authorization' bheja gaya hai ya nahi aur kya wo 'Bearer' se start hota hai
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // String "Bearer eYJ..." ko space se split karke sirf token (2nd part) nikalte hain
            token = req.headers.authorization.split(' ')[1];

            // Token verify karte hain
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Decoded payload se 'id' nikal kar database se user laate hain (bina password ke)
            req.user = await User.findById(decoded.id).select('-password');

            // Sab theek hai, agle function par jao
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // Agar header mein token bheja hi nahi gaya tha
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };

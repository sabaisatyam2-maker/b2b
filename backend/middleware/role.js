// Ye function as a parameter (arguments) alag-alag roles accept karega
const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user hume pichle 'protect' middleware se mil chuka hoga
        // Check karte hain ki kya ye user ka role allowed roles ki list mein hai
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied. Role '${req.user.role}' is not allowed to access this resource.` 
            });
        }
        
        // Agar allowed role hai, toh aage badho
        next();
    };
};

module.exports = { authorize };

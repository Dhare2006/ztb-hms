const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Access Denied. No token." });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid or Expired Token" });
    }
};

// Dynamic Trust Score Engine (ABAC)
const authorize = (roles = []) => {
    return (req, res, next) => {
        let trustScore = 100;
        
        // Zero Trust: Continuous context verification
        if (req.ip === '::1' || req.ip === '127.0.0.1') trustScore -= 10; // Localhost penalty
        if (req.user.role === 'Admin') trustScore += 5; // Admin bonus
        if (req.user.role === 'User') trustScore -= 5; // Standard user base score

        // Smart Contract Logic: If trust score falls below 50, deny access regardless of role
        if (trustScore < 50) {
            return res.status(403).json({ error: "Zero Trust: Trust Score too low. Step-up authentication required." });
        }

        // RBAC Check
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Smart Contract Denied: Insufficient privileges." });
        }
        
        req.trustScore = trustScore; // Pass to route
        next();
    };
};

module.exports = { authenticate, authorize };
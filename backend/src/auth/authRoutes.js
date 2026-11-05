const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// All passwords are 'password123' for the demo
const users = [
    { id: 1, username: 'admin', password: 'password123', role: 'Admin' },
    { id: 2, username: 'doctor', password: 'password123', role: 'Doctor' },
    { id: 3, username: 'nurse', password: 'password123', role: 'Nurse' },
    { id: 4, username: 'labstaff', password: 'password123', role: 'LabStaff' },
    { id: 5, username: 'security', password: 'password123', role: 'Security' },
    { id: 6, username: 'patient', password: 'password123', role: 'Patient' }
];

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Zero Trust: Short-lived JWT (15 minutes)
    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '15m' }
    );
    res.json({ token, role: user.role, message: "Continuous Authentication Verified" });
});

module.exports = router;
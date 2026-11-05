const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. SIMULATED BLOCKCHAIN ENGINE ---
let blockchain = [];
function createBlock(data) {
    const previousHash = blockchain.length > 0 ? blockchain[blockchain.length - 1].hash : "0";
    const timestamp = Date.now();
    const blockString = JSON.stringify(data) + previousHash + timestamp;
    const hash = crypto.createHash('sha256').update(blockString).digest('hex');
    const newBlock = { index: blockchain.length, timestamp, data, previousHash, hash };
    blockchain.push(newBlock);
    return newBlock;
}
createBlock({ message: "Genesis Block - ZTB-HMS Started" });

// --- 2. ZERO TRUST MIDDLEWARE ---
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

const authorize = (roles = []) => {
    return (req, res, next) => {
        let trustScore = 100;
        if (req.ip === '::1' || req.ip === '127.0.0.1') trustScore -= 10;
        if (req.user.role === 'Admin') trustScore += 5;
        
        if (trustScore < 50) {
            return res.status(403).json({ error: "Zero Trust: Trust Score too low." });
        }
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Smart Contract Denied: Insufficient privileges." });
        }
        req.trustScore = trustScore;
        next();
    };
};

// --- 3. AUTHENTICATION ROUTE ---
const users = [
    { id: 1, username: 'admin', password: 'password123', role: 'Admin' },
    { id: 2, username: 'doctor', password: 'password123', role: 'Doctor' },
    { id: 3, username: 'nurse', password: 'password123', role: 'Nurse' },
    { id: 4, username: 'labstaff', password: 'password123', role: 'LabStaff' },
    { id: 5, username: 'security', password: 'password123', role: 'Security' },
    { id: 6, username: 'patient', password: 'password123', role: 'Patient' }
];

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '15m' }
    );
    res.json({ token, role: user.role, message: "Continuous Authentication Verified" });
});

// --- 4. DATA UPLOAD & AI ROUTE ---
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/data/upload', authenticate, authorize(['Admin', 'Doctor']), upload.single('dataset'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        const jsonData = JSON.parse(req.file.buffer.toString('utf8'));
        
        let aiResult = { prediction: "AI Service Offline" };
        try {
            const response = await axios.post('http://localhost:8000/predict', jsonData);
            aiResult = response.data;
        } catch (aiError) {
            console.log("AI Service Error:", aiError.message);
        }

        const dataHash = crypto.createHash('sha256').update(JSON.stringify(jsonData)).digest('hex');
        const block = createBlock({ 
            filename: req.file.originalname, 
            dataHash,
            uploadedBy: req.user.username
        });

        res.json({ trustScore: req.trustScore, aiInsights: aiResult, blockchainRecord: block });
    } catch (error) {
        res.status(400).json({ error: "Invalid JSON format." });
    }
});

// --- 5. VERIFY FILE ROUTE ---
app.post('/api/data/verify-file', authenticate, upload.single('dataset'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    try {
        const jsonData = JSON.parse(req.file.buffer.toString('utf8'));
        const currentHash = crypto.createHash('sha256').update(JSON.stringify(jsonData)).digest('hex');
        
        const found = blockchain.find(b => b.data.dataHash === currentHash);
        
        if (found) res.json({ message: "✅ Integrity Verified: File is securely stored." });
        else res.status(404).json({ message: "🚨 TAMPER DETECTED: Hash mismatch!" });
    } catch (error) {
        res.status(400).json({ error: "Invalid JSON format." });
    }
});

// --- 6. LEDGER ROUTE ---
app.get('/api/blockchain/ledger', authenticate, (req, res) => {
    res.json(blockchain);
});

// --- START SERVER ---
app.listen(process.env.PORT || 5000, () => console.log(`🛡️ Zero Trust Backend running on port ${process.env.PORT || 5000}`));
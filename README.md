<div align="center">

# 🛡️ ZeroTrustX AI
### A Blockchain-Enabled Zero Trust Security Framework for Healthcare (ZTB-HMS)

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Blockchain](https://img.shields.io/badge/Blockchain-SHA256-blueviolet?style=for-the-badge)](https://en.wikipedia.org/wiki/SHA-2)

*An enterprise-grade research prototype implementing the "Never Trust, Always Verify" architecture combined with Machine Learning and Immutable Ledger Technology.*

</div>

---

## 📖 Overview
Traditional Hospital Management Systems (HMS) rely on centralized databases and "trust once, access forever" perimeter security. This makes them highly vulnerable to insider threats, ransomware, and data tampering. 

**ZeroTrustX AI** is a fully functional, full-stack prototype that solves this by integrating:
1. **Zero Trust Architecture (ZTA):** Continuous authentication, JWT sessions, and strict Role-Based Access Control (RBAC).
2. **Machine Learning:** A Python microservice utilizing the `Isolation Forest` algorithm to detect anomalies in patient vitals.
3. **Blockchain Integrity:** A custom SHA-256 hash-chained ledger that detects any unauthorized modification of medical records.

> **🎓 Academic Context:** This project is the working software implementation of the IEEE paper: *"A Blockchain-Enabled Zero Trust Security Framework for Healthcare"*.

---

## ✨ Key Features

*   **🔐 BR-ABAC Engine:** Blockchain and Risk Assessment-Based Access Control dynamically calculates a "Trust Score" based on user role and context.
*   **🧠 AI Anomaly Detection:** Upload patient datasets (JSON) and let the Scikit-Learn model flag high-risk vitals.
*   **⛓️ Tamper-Proof Ledger:** Every uploaded file generates a SHA-256 hash. If a hacker alters a single byte, the system triggers a **TAMPER DETECTED** alert.
*   **👥 Multi-Role Dashboards:** The UI dynamically changes based on the logged-in user (Admin, Doctor, Nurse, Lab Staff, Security, Patient).
*   **📊 Obsidian Clinical Defense Console:** A stunning, glassmorphic dark-mode UI built with Framer Motion and Recharts.
*   **📄 PDF Audit Reports:** Admins and Security analysts can download immutable blockchain audit logs as PDF compliance reports.

---

## 🏗️ System Architecture

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js, Framer Motion, Recharts, Lucide | Obsidian UI, Role-based routing, Live graphs |
| **Backend API** | Node.js, Express.js, JWT | Zero Trust middleware, RBAC, SHA-256 Ledger |
| **AI Service** | Python, FastAPI, Scikit-Learn | Isolation Forest ML anomaly detection |
| **Blockchain** | Custom Node.js Engine | Hash-chaining, Genesis block, Tamper verification |

---

## 🚀 Quick Start Guide

To run this project locally, you need to open **three separate terminals** in VS Code and run the following commands.

**Prerequisites:** Ensure Node.js and Python 3.10+ are installed on your system.

```bash
# ==========================================
# TERMINAL 1: Start the AI Microservice
# ==========================================
cd ai-service
pip install fastapi uvicorn scikit-learn numpy
uvicorn main:app --reload --port 8000

# ==========================================
# TERMINAL 2: Start the Node.js Backend
# ==========================================
cd backend
npm install
node server.js

# ==========================================
# TERMINAL 3: Start the React Frontend
# ==========================================
cd frontend
npm install
npm start
(The UI will automatically open at http://localhost:3000)

**🔑 Demo Credentials**
The system enforces strict Role-Based Access Control. Use the following credentials to test different perspectives (All passwords are password123):

Role	Username	Access Level
Admin	admin	Full access: Patient Ops, Dataset Lab, Billing, Audit Log, Zero Trust Center.
Doctor	doctor	Clinical access: Patient Ops, Dataset Lab, Pharmacy. (No Audit Log).
Nurse	nurse	Triage access: Patient Ops only.
Lab Staff	labstaff	Data access: Dataset Lab and AI only.
Security	security	SOC access: Zero Trust Center and Audit Log only.
Patient	patient	Restricted access: Own Patient Portal only.
🧪 The "Tamper Test" (Live Demo Guide)
To see the Blockchain and AI in action, follow these steps:

Log in as admin.

Go to the Dataset Lab.

Upload a sample patient JSON file (you can create one with fields like heart_rate, blood_pressure, age).

Observe: The Python AI service returns an anomaly prediction, and the file is hashed to the blockchain.

Simulate a Hack: Open the JSON file on your computer, change a single number, and save it as hacked.json.

Upload hacked.json into the Integrity Verification box.

Result: The system will throw a red 🚨 TAMPER DETECTED alert because the SHA-256 hash no longer matches the ledger.

**🔒 Security Measures Implemented**
Short-lived JWTs: Sessions expire in 15 minutes, simulating continuous authentication.

Protected Routes: React ProtectedRoute component prevents URL hacking (e.g., a Nurse typing /blockchain will see an Access Denied screen).

No Exposed Credentials: The login page does not expose demo passwords.

Environment Variables: JWT secrets are stored securely in .env files (git-ignored).

**📜 License**
This project is developed for academic research and demonstration purposes. Not for clinical use.

<div align="center"> <i>Built with ❤️ for the Final Year Project Review.</i> </div> ```

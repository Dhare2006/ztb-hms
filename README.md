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

To run this project locally, you need to open **three separate terminals** in VS Code.

### Prerequisites
*   Node.js installed
*   Python 3.10+ installed

### Terminal 1: Start the AI Microservice
```bash
cd ai-service
pip install fastapi uvicorn scikit-learn numpy
uvicorn main:app --reload --port 8000

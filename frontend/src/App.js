import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, Database, Activity, LogOut, FileKey, UploadCloud, CheckCircle, AlertTriangle, ShieldAlert, Hexagon, ArrowLeft, Stethoscope, Calendar, Beaker, User, Pill, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import './App.css';

// --- CORRECTED PDF IMPORTS ---
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- MOCK DATA FOR CHART ---
const trustData = [
  { time: '08:00', score: 95 }, { time: '09:00', score: 92 },
  { time: '10:00', score: 98 }, { time: '11:00', score: 85 },
  { time: '12:00', score: 90 }, { time: '13:00', score: 96 },
  { time: '14:00', score: 94 }, { time: '15:00', score: 99 },
];

// --- RBAC CONFIGURATION ---
const ROUTE_PERMISSIONS = {
  '/': ['Admin', 'Doctor', 'Nurse', 'LabStaff', 'Security'],
  '/operations': ['Admin', 'Doctor', 'Nurse'],
  '/dataset': ['Admin', 'Doctor', 'LabStaff'],
  '/zero-trust': ['Admin', 'Security'],
  '/blockchain': ['Admin', 'Security'],
  '/patient-portal': ['Patient'],
  '/pharmacy': ['Admin', 'Doctor'],
  '/billing': ['Admin'],
};

// --- COMPONENTS ---
const Sidebar = ({ setToken }) => {
  const location = useLocation();
  const role = sessionStorage.getItem('role'); 

  const navItems = [
    { path: '/', name: 'Overview', icon: <LayoutDashboard size={20} />, roles: ['Admin', 'Doctor', 'Nurse', 'LabStaff', 'Security'] },
    { path: '/operations', name: 'Hospital Ops', icon: <Stethoscope size={20} />, roles: ['Admin', 'Doctor', 'Nurse'] },
    { path: '/dataset', name: 'Dataset Lab & AI', icon: <Database size={20} />, roles: ['Admin', 'Doctor', 'LabStaff'] },
    { path: '/pharmacy', name: 'Pharmacy', icon: <Pill size={20} />, roles: ['Admin', 'Doctor'] },
    { path: '/billing', name: 'Billing', icon: <CreditCard size={20} />, roles: ['Admin'] },
    { path: '/zero-trust', name: 'Zero Trust Center', icon: <ShieldAlert size={20} />, roles: ['Admin', 'Security'] },
    { path: '/blockchain', name: 'Audit Log', icon: <FileKey size={20} />, roles: ['Admin', 'Security'] },
    { path: '/patient-portal', name: 'Patient Portal', icon: <User size={20} />, roles: ['Patient'] },
  ];

  const allowedNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="sidebar">
      <div className="logo">
        <Hexagon size={32} className="logo-icon text-cyan" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '20px', lineHeight: '1.2' }}>ZeroTrustX</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px' }}>ZTB-HMS PLATFORM</span>
        </div>
      </div>
      
      <div style={{ padding: '0 20px 20px', fontSize: '12px', color: 'var(--cyan)' }}>
        Logged in as: <strong>{role}</strong>
      </div>

      <nav>
        {allowedNavItems.map((item) => (
          <Link key={item.path} to={item.path} className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}>
            {item.icon} {item.name}
          </Link>
        ))}
      </nav>
      <button className="logout-btn" onClick={() => { sessionStorage.clear(); setToken(''); }}>
        <LogOut size={20} /> Secure Logout
      </button>
    </div>
  );
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = sessionStorage.getItem('role');
  if (!allowedRoles.includes(role)) {
    return (
      <div className="glass panel" style={{ textAlign: 'center', marginTop: '50px' }}>
        <ShieldAlert size={48} className="text-red" style={{ margin: '0 auto 20px' }} />
        <h2 style={{ color: 'var(--red)' }}>Access Denied</h2>
        <p className="text-muted">Zero Trust policy blocked this request. Your role ({role}) does not have the required attributes.</p>
      </div>
    );
  }
  return children;
};

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [isForgot, setIsForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://zerotrustx-backend.onrender.com/api/auth/login', { username, password });
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('role', res.data.role);
      setToken(res.data.token);
    } catch (err) {
      setError('Access Denied: Invalid Credentials');
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    setResetMsg('If this account exists, a secure reset link has been dispatched.');
    setTimeout(() => { setIsForgot(false); setResetMsg(''); }, 4000);
  };

  return (
    <div className="login-container">
      <div className="bg-grid"></div>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="login-box glass">
        <Hexagon size={56} className="logo-icon text-cyan" style={{margin: '0 auto'}} />
        <h2>ZeroTrustX AI</h2>
        <p className="text-muted" style={{marginBottom: '25px', fontSize:'13px', letterSpacing: '1px'}}>
          BR-ABAC & DYNAMIC TRUST GATEWAY
        </p>
        
        {error && !isForgot && <div className="alert error">{error}</div>}
        
        {!isForgot ? (
          <>
            <form onSubmit={handleLogin}>
              <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
              <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
              <button type="submit" className="btn-primary">Sign In</button>
            </form>
            <div style={{ marginTop: '15px' }}>
              <span onClick={() => { setIsForgot(true); setError(''); }} style={{ color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
                Forgot Password?
              </span>
            </div>
          </>
        ) : (
          <>
            <p style={{color: 'var(--text-main)', fontSize: '14px', marginBottom: '20px'}}>Enter registered email for reset link.</p>
            {resetMsg && <div className="alert success" style={{marginBottom: '15px', fontSize: '13px'}}>{resetMsg}</div>}
            <form onSubmit={handleReset}>
              <input type="email" placeholder="Registered Email" onChange={e => setResetEmail(e.target.value)} required />
              <button type="submit" className="btn-primary">Send Reset Link</button>
            </form>
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'var(--cyan)' }} onClick={() => setIsForgot(false)}>
               <ArrowLeft size={16} /> Back to Login
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

// --- DASHBOARD PAGES ---

const Dashboard = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    <h1 className="page-title">System Overview</h1>
    <div className="stats-grid">
      <div className="stat-card glass">
        <div className="icon-wrapper bg-cyan-light"><Activity size={28} className="text-cyan" /></div>
        <div><h3>System Posture</h3><p className="text-cyan">Optimal</p></div>
      </div>
      <div className="stat-card glass">
        <div className="icon-wrapper bg-violet-light"><Database size={28} className="text-violet" /></div>
        <div><h3>Datasets Analyzed</h3><p className="text-violet">24</p></div>
      </div>
      <div className="stat-card glass">
        <div className="icon-wrapper bg-green-light"><Shield size={28} className="text-green" /></div>
        <div><h3>Zero Trust Status</h3><p className="text-green">Enforcing</p></div>
      </div>
    </div>
    <div className="glass panel mt-4">
      <h2><Activity size={20} className="text-cyan" /> Trust Score Trend (Last 8 Hours)</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={trustData}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#4a5568" />
            <YAxis stroke="#4a5568" domain={[50, 100]} />
            <Tooltip contentStyle={{ backgroundColor: '#0B0F16', border: '1px solid #00f0ff', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="score" stroke="#00f0ff" fillOpacity={1} fill="url(#colorScore)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </motion.div>
);

const HospitalOperations = () => {
  const records = [
    { id: 'P-1001', name: 'John Doe', status: 'Admitted', room: 'ICU-04', risk: 'High' },
    { id: 'P-1002', name: 'Jane Smith', status: 'Outpatient', room: 'N/A', risk: 'Low' },
    { id: 'P-1003', name: 'Robert Johnson', status: 'Discharged', room: 'N/A', risk: 'Normal' },
    { id: 'P-1004', name: 'Emily Davis', status: 'Admitted', room: 'Ward-B2', risk: 'Medium' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Hospital Operations</h1>
      <div className="glass panel">
        <h2><Stethoscope size={20} className="text-cyan" /> Patient Directory (Mock DB)</h2>
        <p className="text-muted mb-2">Operational data stored securely in PostgreSQL (simulated).</p>
        <table className="ledger-table">
          <thead><tr><th>Patient ID</th><th>Name</th><th>Status</th><th>Room</th><th>AI Risk Level</th></tr></thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i}>
                <td className="text-cyan font-bold">{r.id}</td>
                <td>{r.name}</td>
                <td>{r.status}</td>
                <td>{r.room}</td>
                <td>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                    background: r.risk === 'High' ? 'rgba(239, 68, 68, 0.2)' : r.risk === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: r.risk === 'High' ? 'var(--red)' : r.risk === 'Medium' ? '#f59e0b' : 'var(--green)' }}>
                    {r.risk}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const DatasetLab = () => {
  const [file, setFile] = useState(null);
  const [verifyFile, setVerifyFile] = useState(null);
  const [result, setResult] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const token = sessionStorage.getItem('token');

  const handleUpload = async () => {
    if (!file) return toast.warning("Please select a file to upload.");
    const formData = new FormData();
    formData.append('dataset', file);
    try {
      const res = await axios.post('http://localhost:5000/api/data/upload', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
      toast.success("Data processed and secured in Blockchain!");
    } catch (err) {
      toast.error(`Upload failed: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleVerify = async () => {
    if (!verifyFile) return toast.warning("Please select a file to verify.");
    const formData = new FormData();
    formData.append('dataset', verifyFile);
    try {
      const res = await axios.post('http://localhost:5000/api/data/verify-file', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setVerifyResult({ success: true, msg: res.data.message });
      toast.success("Integrity Verified: File is authentic.");
    } catch (err) {
      setVerifyResult({ success: false, msg: err.response?.data?.message || 'Error verifying file' });
      toast.error("TAMPER DETECTED: Hash mismatch!");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Dataset Lab & AI</h1>
      <div className="grid-2">
        <div className="glass panel">
          <h2><UploadCloud size={20} className="text-cyan"/> AI Analysis Pipeline</h2>
          <p className="text-muted mb-2">Upload JSON to run ML anomaly detection & hash to the blockchain.</p>
          <input type="file" className="file-input" onChange={e => setFile(e.target.files[0])} />
          <button className="btn-primary mt-2" onClick={handleUpload}>Process & Secure Data</button>
          {result && (
            <div className="alert success mt-4">
              <CheckCircle size={24} /> 
              <div><strong>Trust Score: {result.trustScore}/100</strong><br/><span>{result.aiInsights.prediction}</span></div>
            </div>
          )}
        </div>
        <div className="glass panel">
          <h2><AlertTriangle size={20} className="text-red"/> Integrity Verification</h2>
          <p className="text-muted mb-2">Upload a file to verify its SHA-256 hash against the immutable ledger.</p>
          <input type="file" className="file-input" onChange={e => setVerifyFile(e.target.files[0])} />
          <button className="btn-secondary mt-2" onClick={handleVerify}>Verify File Hash</button>
          {verifyResult && (
            <div className={`alert ${verifyResult.success ? 'success' : 'error'} mt-4`}>{verifyResult.msg}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ZeroTrustCenter = () => {
  const events = [
    { time: '10:42:01', event: 'Blockchain Hash Synced', status: 'SUCCESS', icon: <FileKey size={16}/> },
    { time: '10:41:55', event: 'Admin accessed Dataset Lab', status: 'SUCCESS', icon: <CheckCircle size={16}/> },
    { time: '10:41:30', event: 'AI Anomaly Model Executed', status: 'SUCCESS', icon: <Activity size={16}/> },
    { time: '10:40:12', event: 'Failed Login Attempt (IP: 192.168.1.5)', status: 'BLOCKED', icon: <AlertTriangle size={16}/> },
    { time: '10:38:00', event: 'Trust Score Dropped to 65 (Step-up Auth)', status: 'WARNING', icon: <ShieldAlert size={16}/> },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="page-title">Zero Trust Center</h1>
      <div className="glass panel">
        <h2><ShieldAlert size={20} className="text-cyan" /> Live Security Events</h2>
        <div className="soc-feed">
          {events.map((e, i) => (
            <div key={i} className="soc-event">
              <span className="soc-time">{e.time}</span>
              <span className={`soc-status ${e.status.toLowerCase()}`}>{e.icon} {e.status}</span>
              <span className="soc-msg">{e.event}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const BlockchainLedger = () => {
  const [ledger, setLedger] = useState([]);
  const token = sessionStorage.getItem('token'); 

  useEffect(() => {
    axios.get('http://localhost:5000/api/blockchain/ledger', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setLedger(res.data));
  }, [token]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 240, 255);
    doc.text("ZeroTrustX AI - Blockchain Audit Log", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    const tableData = ledger.map(b => [
      `#${b.index}`, 
      b.data.filename || 'Genesis Block', 
      b.data.uploadedBy || 'System', 
      b.hash.substring(0, 30) + '...'
    ]);

    // CORRECTED AUTOTABLE SYNTAX
    autoTable(doc, {
      head: [['Block', 'File Name', 'User', 'SHA-256 Hash']],
      body: tableData,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [16, 33, 65], textColor: [0, 240, 255] },
    });

    doc.save('ZeroTrustX_Audit_Log.pdf');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Audit Log (Restricted)</h1>
        <button onClick={downloadPDF} className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }}>
          Download PDF Report
        </button>
      </div>
      
      <div className="glass panel">
        <h2><FileKey size={20} className="text-violet" /> Blockchain Audit Trail</h2>
        <table className="ledger-table">
          <thead><tr><th>Block</th><th>File Name</th><th>User</th><th>SHA-256 Hash</th></tr></thead>
          <tbody>
            {ledger.map((b, i) => (
              <tr key={i}>
                <td className="text-cyan font-bold">#{b.index}</td>
                <td>{b.data.filename || 'Genesis Block'}</td>
                <td>{b.data.uploadedBy || 'System'}</td>
                <td className="hash-text">{b.hash.substring(0, 35)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

const PatientPortal = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 className="page-title">Patient Portal</h1>
    <div className="glass panel">
      <h2><User size={20} className="text-cyan" /> My Health Records</h2>
      <p className="text-muted mb-2">Secure access via Zero Trust identity verification.</p>
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '8px', marginTop: '20px', borderLeft: '4px solid var(--cyan)' }}>
        <h3 style={{ color: 'var(--cyan)', marginBottom: '10px' }}>Blood Test Results (May 2026)</h3>
        <p><strong>Status:</strong> Normal</p>
        <p><strong>Doctor Notes:</strong> All vitals within expected range.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '15px', color: 'var(--green)', fontSize: '14px' }}>
          <Shield size={16} /> Blockchain Verified: Integrity Intact
        </div>
      </div>
    </div>
  </motion.div>
);

const Pharmacy = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 className="page-title">Pharmacy Module</h1>
    <div className="glass panel"><h2><Pill size={20} className="text-cyan" /> Prescription Dispensing</h2><p className="text-muted">Mock UI for authorized staff only.</p></div>
  </motion.div>
);

const Billing = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 className="page-title">Billing Module</h1>
    <div className="glass panel"><h2><CreditCard size={20} className="text-cyan" /> Insurance Claims</h2><p className="text-muted">Mock UI for authorized staff only.</p></div>
  </motion.div>
);

function App() {
  const [token, setToken] = useState(sessionStorage.getItem('token') || '');

  if (!token) return <Login setToken={setToken} />;

  return (
    <Router>
      <div className="layout">
        <Sidebar setToken={setToken} />
        <div className="main-content">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--green)', padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green)', fontWeight: 'bold', fontSize: '14px' }}>
              <Shield size={16} /> Trust Score: 100/100
            </div>
          </div>

          <Routes>
            <Route path="/" element={<ProtectedRoute allowedRoles={ROUTE_PERMISSIONS['/']}><Dashboard /></ProtectedRoute>} />
            <Route path="/operations" element={<ProtectedRoute allowedRoles={ROUTE_PERMISSIONS['/operations']}><HospitalOperations /></ProtectedRoute>} />
            <Route path="/dataset" element={<ProtectedRoute allowedRoles={ROUTE_PERMISSIONS['/dataset']}><DatasetLab /></ProtectedRoute>} />
            <Route path="/zero-trust" element={<ProtectedRoute allowedRoles={ROUTE_PERMISSIONS['/zero-trust']}><ZeroTrustCenter /></ProtectedRoute>} />
            <Route path="/blockchain" element={<ProtectedRoute allowedRoles={ROUTE_PERMISSIONS['/blockchain']}><BlockchainLedger /></ProtectedRoute>} />
            <Route path="/patient-portal" element={<ProtectedRoute allowedRoles={ROUTE_PERMISSIONS['/patient-portal']}><PatientPortal /></ProtectedRoute>} />
            <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={ROUTE_PERMISSIONS['/pharmacy']}><Pharmacy /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute allowedRoles={ROUTE_PERMISSIONS['/billing']}><Billing /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
      <ToastContainer theme="dark" position="bottom-right" />
    </Router>
  );
}

export default App;
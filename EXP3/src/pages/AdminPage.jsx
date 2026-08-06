import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <ShieldCheck color="#ef4444" size={32} />
          Admin Portal
        </h1>
        <button className="btn" onClick={() => navigate('/dashboard')} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}>
          <ArrowLeft size={18} />
          Back
        </button>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem' }}>
        <h2>Highly Sensitive Data</h2>
        <p className="text-muted">This page is only accessible by users with the <code>admin</code> role.</p>
        <p>System settings, user management, and destructive actions would be located here.</p>
      </div>
    </div>
  );
};

export default AdminPage;

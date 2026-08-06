import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '2rem' }}>
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', maxWidth: '500px' }}>
        <ShieldAlert size={64} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h1 style={{ marginBottom: '1rem' }}>Access Denied</h1>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
        </p>
        <button className="btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;

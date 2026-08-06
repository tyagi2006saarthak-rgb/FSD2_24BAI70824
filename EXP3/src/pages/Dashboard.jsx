import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldCheck, UserCircle, Activity, ShieldAlert, Edit3, Eye } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tokenPreview, setTokenPreview] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const parts = token.split('.');
      if (parts.length === 3) {
        setTokenPreview(`${parts[0]}.\n${parts[1]}.\n${parts[2].substring(0, 10)}...`);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem', flex: 1 }}>
      
      <div style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
          <ShieldCheck color="var(--primary)" size={32} />
          Secure Dashboard
        </h1>
        <button className="btn" onClick={handleLogout} style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)' }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          <UserCircle color="var(--primary)" size={24} />
          User Profile
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <p className="text-muted" style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Username</p>
            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: '500' }}>{user.username}</p>
          </div>
          <div>
            <p className="text-muted" style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem' }}>Role</p>
            <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: '500' }}>
              <span style={{ 
                background: user.role === 'admin' ? 'rgba(239, 68, 68, 0.2)' : user.role === 'editor' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(99, 102, 241, 0.2)', 
                color: user.role === 'admin' ? '#ef4444' : user.role === 'editor' ? '#f59e0b' : '#818cf8', 
                padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.875rem' 
              }}>
                {user.role.toUpperCase()}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Activity color="var(--primary)" size={24} />
          Role-Based Actions
        </h2>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>
          These actions are conditionally rendered based on your assigned role.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Viewer and above */}
          <button className="btn" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
            <Eye size={18} />
            View Data
          </button>

          {/* Editor and above */}
          {['admin', 'editor'].includes(user.role) && (
            <button className="btn" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid #f59e0b', color: '#f59e0b' }} onClick={() => navigate('/editor')}>
              <Edit3 size={18} />
              Edit Content (Editor+)
            </button>
          )}

          {/* Admin only */}
          {user.role === 'admin' && (
            <button className="btn" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444' }} onClick={() => navigate('/admin')}>
              <ShieldAlert size={18} />
              Manage System (Admin)
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

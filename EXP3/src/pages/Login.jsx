import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { generateMockToken } from '../utils/mockJwt';
import { LogIn, User, Lock, Key } from 'lucide-react';

const mockUsers = {
  admin: { id: 1, username: 'Saarthak', role: 'admin', password: 'admin111' },
  editor: { id: 2, username: 'Deepchand', role: 'editor', password: 'editor111' },
  viewer: { id: 3, username: 'Akshit', role: 'viewer', password: 'viewer111' }
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // Mock validation
      const user = Object.values(mockUsers).find(u => u.username === username);
      if (user && user.password === password) {
        // Exclude password from token payload
        const { password: _, ...payload } = user;
        const token = generateMockToken(payload);
        login(token);
        navigate('/dashboard');
      } else {
        setError('Invalid username or password.');
      }
      setIsLoading(false);
    }, 800);
  };

  const autoFill = (role) => {
    setUsername(mockUsers[role].username);
    setPassword(mockUsers[role].password);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '1rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem', marginBottom: '2rem' }}>
        <div className="text-center mb-6">
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', marginBottom: '1rem' }}>
            <LogIn size={32} color="var(--primary)" />
          </div>
          <h2>Welcome Back</h2>
          <p className="text-muted">Sign in to continue to your dashboard.</p>
        </div>

        {error && <div className="text-error mb-4 text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="input-label">Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-field"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="input-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="input-field"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '1.5rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={18} color="var(--primary)" />
          Quick Test Accounts
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} onClick={() => autoFill('admin')}>Admin</button>
          <button type="button" className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} onClick={() => autoFill('editor')}>Editor</button>
          <button type="button" className="btn" style={{ flex: 1, padding: '0.5rem', fontSize: '0.875rem' }} onClick={() => autoFill('viewer')}>Viewer</button>
        </div>
      </div>
    </div>
  );
};

export default Login;

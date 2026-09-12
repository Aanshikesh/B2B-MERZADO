import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ErrorMessage } from '../../components/CommonUI';
import { LogIn, KeyRound, Sparkles, Building, Briefcase } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickFill = (type) => {
    if (type === 'buyer') {
      setEmail('buyer@market.com');
      setPassword('password123');
    } else {
      setEmail('supplier@market.com');
      setPassword('password123');
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const user = await login(email, password);
      if (user.role === 'buyer') {
        navigate('/buyer/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2.5rem auto' }}>
      {/* Demo Credentials Quick Bar */}
      <div className="demo-bar">
        <div className="demo-bar-title">
          <Sparkles size={16} />
          <span>Quick Demo Access:</span>
        </div>
        <div className="demo-pill-group">
          <button
            type="button"
            className="demo-pill"
            onClick={() => handleQuickFill('buyer')}
          >
            <Building size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Buyer
          </button>
          <button
            type="button"
            className="demo-pill"
            onClick={() => handleQuickFill('supplier')}
          >
            <Briefcase size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Supplier
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <LogIn size={24} />
          </div>
          <h2>Welcome Back</h2>
          <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your RFQs and quotations
          </p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              Email Address <span className="req">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. buyer@market.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="req">*</span>
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}
        >
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

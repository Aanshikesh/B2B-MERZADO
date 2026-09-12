import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ErrorMessage } from '../../components/CommonUI';
import { UserPlus, Building, Briefcase } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    companyName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.companyName) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const user = await register(formData);
      if (user.role === 'buyer') {
        navigate('/buyer/dashboard');
      } else {
        navigate('/marketplace');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check the information provided.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '520px', margin: '2rem auto' }}>
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
            <UserPlus size={24} />
          </div>
          <h2>Create Your Account</h2>
          <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join the B2B RFQ Marketplace as a Buyer or Supplier
          </p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          {/* Role Selection Tabs */}
          <div className="form-group">
            <label className="form-label">
              I want to participate as: <span className="req">*</span>
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '0.5rem'
              }}
            >
              <button
                type="button"
                onClick={() => handleRoleSelect('buyer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border:
                    formData.role === 'buyer'
                      ? '2px solid var(--primary)'
                      : '1px solid var(--border-color)',
                  background:
                    formData.role === 'buyer'
                      ? 'rgba(99, 102, 241, 0.15)'
                      : 'var(--bg-surface-elevated)',
                  color: formData.role === 'buyer' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <Building size={18} color={formData.role === 'buyer' ? '#818cf8' : undefined} />
                <span>Buyer (Procurement)</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('supplier')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border:
                    formData.role === 'supplier'
                      ? '2px solid var(--secondary)'
                      : '1px solid var(--border-color)',
                  background:
                    formData.role === 'supplier'
                      ? 'rgba(6, 182, 212, 0.15)'
                      : 'var(--bg-surface-elevated)',
                  color: formData.role === 'supplier' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <Briefcase size={18} color={formData.role === 'supplier' ? '#22d3ee' : undefined} />
                <span>Supplier (Vendor)</span>
              </button>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {formData.role === 'buyer'
                ? 'Buyers post business requirements (RFQs) and review supplier quotations.'
                : 'Suppliers browse available market requirements and submit competitive bids.'}
            </span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Full Name <span className="req">*</span>
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Jane Doe"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Company / Business Name <span className="req">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                className="form-control"
                placeholder="e.g. Acme Industries Ltd."
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Email Address <span className="req">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="e.g. contact@acme.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (Optional)</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Password <span className="req">*</span>
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Register as ${formData.role === 'buyer' ? 'Buyer' : 'Supplier'}`}
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
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

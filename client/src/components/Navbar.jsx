import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Layers, 
  PlusCircle, 
  FileText, 
  LogOut, 
  Compass, 
  User as UserIcon 
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isBuyer, isSupplier, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon-box">
            <Layers size={20} />
          </div>
          <span>NexusRFQ</span>
          <span className="brand-badge">B2B Portal</span>
        </Link>

        {/* Links */}
        <div className="nav-links">
          <Link 
            to="/marketplace" 
            className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}
          >
            <Compass size={16} />
            <span>Browse RFQs</span>
          </Link>

          {isAuthenticated ? (
            <>
              {isBuyer && (
                <>
                  <Link 
                    to="/buyer/dashboard" 
                    className={`nav-link ${isActive('/buyer/dashboard') ? 'active' : ''}`}
                  >
                    <Building2 size={16} />
                    <span>My RFQs</span>
                  </Link>
                  <Link 
                    to="/buyer/create-rfq" 
                    className="btn btn-primary btn-sm"
                  >
                    <PlusCircle size={15} />
                    <span>Post RFQ</span>
                  </Link>
                </>
              )}

              {isSupplier && (
                <Link 
                  to="/supplier/quotations" 
                  className={`nav-link ${isActive('/supplier/quotations') ? 'active' : ''}`}
                >
                  <FileText size={16} />
                  <span>My Quotations</span>
                </Link>
              )}

              {/* User Pill */}
              <div className="nav-user-pill">
                <UserIcon size={14} style={{ color: 'var(--text-muted)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, lineHeight: 1.1 }}>
                    {user.name}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {user.companyName}
                  </span>
                </div>
                <span className={`role-badge ${user.role}`}>
                  {user.role}
                </span>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout} 
                className="btn btn-outline btn-sm" 
                title="Log Out"
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Briefcase, 
  Layers, 
  CheckCircle, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Clock 
} from 'lucide-react';

export const Home = () => {
  const { isAuthenticated, isBuyer } = useAuth();

  // If already logged in, route them to their respective operational workspace
  if (isAuthenticated) {
    return isBuyer ? <Navigate to="/buyer/dashboard" replace /> : <Navigate to="/marketplace" replace />;
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem 0' }}>
      {/* Hero Section */}
      <div
        style={{
          textAlign: 'center',
          padding: '3.5rem 1.5rem',
          background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.12) 0%, rgba(17, 25, 46, 0.4) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
          marginBottom: '3rem'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            color: '#a5b4fc',
            fontSize: '0.825rem',
            fontWeight: 600,
            marginBottom: '1.25rem'
          }}
        >
          <Layers size={15} />
          <span>Enterprise B2B Procurement Platform</span>
        </div>

        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Streamlined B2B Request for Quotation (RFQ) Marketplace
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            maxWidth: '680px',
            margin: '0 auto 2rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}
        >
          Connect procurement teams with vetted industrial suppliers. Post custom requirements, gather competitive bids, compare timelines, and negotiate with transparency.
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <Link to="/marketplace" className="btn btn-primary btn-lg">
            <span>Explore RFQ Marketplace</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            <span>Sign In / Demo Access</span>
          </Link>
        </div>
      </div>

      {/* Role Feature Comparison Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}
      >
        {/* Buyer Pillar */}
        <div className="card card-hover" style={{ borderTop: '4px solid var(--primary)' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <Building2 size={24} />
          </div>
          <h2>For Procurement Buyers</h2>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            Broadcast business requirements to an active vendor network and receive verified quotes with delivery guarantees.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <CheckCircle size={16} color="var(--primary)" />
              <span>Post detailed RFQs with quantities, specs & deadlines</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <CheckCircle size={16} color="var(--primary)" />
              <span>Receive and compare competitive bids side-by-side</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <CheckCircle size={16} color="var(--primary)" />
              <span>Easily edit, manage, or close active requirements</span>
            </li>
          </ul>
        </div>

        {/* Supplier Pillar */}
        <div className="card card-hover" style={{ borderTop: '4px solid var(--secondary)' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.15)',
              color: '#22d3ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <Briefcase size={24} />
          </div>
          <h2>For Industrial Suppliers</h2>
          <p style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            Find active enterprise contracts matching your manufacturing capabilities and quote with precision.
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <CheckCircle size={16} color="var(--secondary)" />
              <span>Browse real-time requirements with keyword & status filters</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <CheckCircle size={16} color="var(--secondary)" />
              <span>Submit tailored pricing, delivery lead times & notes</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <CheckCircle size={16} color="var(--secondary)" />
              <span>Track, update, and manage all your historical bids</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

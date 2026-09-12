import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rfqService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  StatusBadge
} from '../../components/CommonUI';
import {
  Search,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  Building,
  CheckCircle,
  MessageSquare,
  Clock
} from 'lucide-react';

export const SupplierMarketplace = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('open'); // default to open RFQs

  const { isSupplier } = useAuth();

  const fetchRFQs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      const data = await rfqService.getAll(params);
      setRfqs(data.rfqs || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load RFQs from marketplace.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search/filter
    const timeout = setTimeout(() => {
      fetchRFQs();
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchTerm, statusFilter]);

  return (
    <div>
      {/* Hero Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#22d3ee', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          <Layers size={16} />
          <span>B2B Procurement Marketplace</span>
        </div>
        <h1>Browse Business Requirements (RFQs)</h1>
        <p>Discover real-time industrial and enterprise requirements posted by verified corporate buyers</p>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        {/* Search Input */}
        <div
          style={{
            position: 'relative',
            flex: '1',
            minWidth: '260px'
          }}
        >
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search by product, material, specifications, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>

        {/* Status Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status:</span>
          {['open', 'all', 'closed'].map((status) => (
            <button
              key={status}
              type="button"
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(status)}
              style={{ textTransform: 'capitalize' }}
            >
              {status === 'open' ? 'Open Only' : status}
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner text="Searching marketplace requirements..." />
      ) : rfqs.length === 0 ? (
        <EmptyState
          title="No matching RFQs found"
          description={
            searchTerm
              ? `No business requirements matched "${searchTerm}". Try broadening your search keywords.`
              : 'There are currently no RFQs listed under this filter.'
          }
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {rfqs.map((rfq) => {
            const deadlineDate = new Date(rfq.deadline);
            const isExpired = deadlineDate < new Date();
            const isOpen = rfq.status === 'open' && !isExpired;

            return (
              <div
                key={rfq._id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem'
                }}
              >
                <div>
                  {/* Top Badges */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <StatusBadge status={isOpen ? 'open' : 'closed'} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <Building size={14} />
                      <span>{rfq.buyer?.companyName || 'Verified Buyer'}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ marginBottom: '0.6rem', lineHeight: 1.3 }}>{rfq.title}</h3>

                  {/* Description preview */}
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '1rem',
                      lineHeight: 1.5
                    }}
                  >
                    {rfq.description}
                  </p>

                  {/* Key specs pills */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Layers size={14} color="var(--primary)" />
                      <span>
                        Quantity: <strong>{rfq.quantity.toLocaleString()} {rfq.unit || 'units'}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <MapPin size={14} color="var(--primary)" />
                      <span>{rfq.deliveryLocation}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Calendar size={14} color={isExpired ? '#f87171' : 'var(--primary)'} />
                      <span style={{ color: isExpired ? '#f87171' : 'inherit' }}>
                        Deadline: {deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        {isExpired && ' (Expired)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div
                  style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <MessageSquare size={13} />
                    <span>{rfq.quotationCount || 0} quote{rfq.quotationCount === 1 ? '' : 's'}</span>
                  </div>

                  <Link
                    to={`/supplier/rfq/${rfq._id}`}
                    className={`btn btn-sm ${isOpen ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    <span>{isSupplier && isOpen ? 'Quote Now' : 'View Details'}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

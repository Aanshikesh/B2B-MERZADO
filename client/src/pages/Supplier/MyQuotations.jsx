import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quotationService } from '../../services/api';
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  StatusBadge,
  StatCard
} from '../../components/CommonUI';
import {
  FileText,
  DollarSign,
  Clock,
  Building,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';

export const MyQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await quotationService.getMyQuotations();
      setQuotations(data.quotations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your submitted quotations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const totalQuotes = quotations.length;
  const totalValue = quotations.reduce((sum, q) => sum + (q.price || 0), 0);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <h1>My Submitted Quotations</h1>
          <p>Track bids, prices, and delivery terms you have offered to corporate buyers</p>
        </div>
        <Link to="/marketplace" className="btn btn-primary">
          <Layers size={18} />
          <span>Browse More RFQs</span>
        </Link>
      </div>

      {/* Metrics */}
      <div className="stats-grid">
        <StatCard
          icon={FileText}
          color="cyan"
          value={totalQuotes}
          label="Total Bids Submitted"
        />
        <StatCard
          icon={DollarSign}
          color="emerald"
          value={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          label="Aggregate Bid Value"
        />
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner text="Fetching your submitted bids..." />
      ) : quotations.length === 0 ? (
        <EmptyState
          title="No quotations submitted yet"
          description="You haven't submitted quotations for any buyer requirements yet. Explore the marketplace to find open RFQs matching your manufacturing and supply capabilities."
          action={
            <Link to="/marketplace" className="btn btn-primary">
              <Layers size={16} />
              <span>Explore Marketplace</span>
            </Link>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {quotations.map((quote) => {
            const rfq = quote.rfq || {};
            const deadlineDate = rfq.deadline ? new Date(rfq.deadline) : null;
            const isExpired = deadlineDate && deadlineDate < new Date();

            return (
              <div
                key={quote._id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: '4px solid var(--secondary)'
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <StatusBadge status={rfq.status} />
                      {isExpired && (
                        <span style={{ fontSize: '0.75rem', color: '#f87171' }}>(Deadline Passed)</span>
                      )}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Quoted on {new Date(quote.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>{rfq.title || 'RFQ Requirement'}</h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.2rem'
                      }}
                    >
                      <Building size={14} color="var(--primary)" />
                      <span>Buyer: <strong>{rfq.buyer?.companyName || 'Corporate Buyer'}</strong></span>
                    </div>
                  </div>

                  {/* Quoted Price */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Your Quoted Price
                    </div>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 800,
                        color: '#34d399',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      ${quote.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Body Details */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.85rem',
                        color: '#22d3ee',
                        fontWeight: 600,
                        marginBottom: '0.4rem'
                      }}
                    >
                      <Clock size={15} />
                      <span>Delivery Lead Time: {quote.estimatedDeliveryTime}</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      <strong>Your Terms & Notes:</strong>
                      <p style={{ marginTop: '0.25rem', whiteSpace: 'pre-line' }}>{quote.notes}</p>
                    </div>
                  </div>

                  {/* RFQ Reference Summary */}
                  <div
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                      Requirement Summary
                    </div>
                    <div>
                      Quantity: <strong>{rfq.quantity ? rfq.quantity.toLocaleString() : 'N/A'} {rfq.unit || 'units'}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                      <MapPin size={13} />
                      <span>{rfq.deliveryLocation}</span>
                    </div>
                    {deadlineDate && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                        <Calendar size={13} />
                        <span>Deadline: {deadlineDate.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-color)'
                  }}
                >
                  {rfq._id && (
                    <Link
                      to={`/supplier/rfq/${rfq._id}`}
                      className="btn btn-outline btn-sm"
                    >
                      <span>View / Update Bid</span>
                      <ExternalLink size={14} />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

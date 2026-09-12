import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { rfqService } from '../../services/api';
import {
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage,
  EmptyState,
  StatusBadge
} from '../../components/CommonUI';
import {
  ArrowLeft,
  Edit3,
  Calendar,
  MapPin,
  Package,
  Clock,
  DollarSign,
  Building,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';

export const RFQDetailsBuyer = () => {
  const { id } = useParams();
  const [rfq, setRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await rfqService.getById(id);
      setRfq(data.rfq);
      setQuotations(data.quotations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load RFQ details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!rfq) return;
    const nextStatus = rfq.status === 'open' ? 'closed' : 'open';
    try {
      setStatusUpdating(true);
      setError('');
      setSuccess('');
      const res = await rfqService.update(rfq._id, { status: nextStatus });
      setRfq(res.rfq);
      setSuccess(`RFQ marked as ${nextStatus.toUpperCase()} successfully.`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update RFQ status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading RFQ specifications and quotations..." />;
  }

  if (!rfq) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <ErrorMessage message={error || 'RFQ not found.'} />
        <Link to="/buyer/dashboard" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    );
  }

  const deadlineDate = new Date(rfq.deadline);
  const isExpired = deadlineDate < new Date() && rfq.status === 'open';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Top Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <Link to="/buyer/dashboard" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} />
          <span>Back to My RFQs</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleToggleStatus}
            className={`btn btn-sm ${rfq.status === 'open' ? 'btn-danger' : 'btn-secondary'}`}
            disabled={statusUpdating}
          >
            {rfq.status === 'open' ? (
              <>
                <XCircle size={15} />
                <span>Close RFQ</span>
              </>
            ) : (
              <>
                <CheckCircle size={15} />
                <span>Re-open RFQ</span>
              </>
            )}
          </button>
          <Link to={`/buyer/edit-rfq/${rfq._id}`} className="btn btn-primary btn-sm">
            <Edit3 size={15} />
            <span>Edit RFQ</span>
          </Link>
        </div>
      </div>

      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      {/* RFQ Main Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <StatusBadge status={rfq.status} />
              {isExpired && (
                <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600 }}>
                  (Deadline Passed)
                </span>
              )}
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Posted on {new Date(rfq.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1>{rfq.title}</h1>
          </div>
        </div>

        {/* Specifications Highlight Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1.25rem',
            background: 'var(--bg-surface-elevated)',
            borderRadius: 'var(--radius-md)',
            margin: '1.25rem 0'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Quantity Required
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>
              {rfq.quantity.toLocaleString()} {rfq.unit || 'units'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Delivery Location
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#fff',
                marginTop: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <MapPin size={15} color="var(--primary)" />
              {rfq.deliveryLocation}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Submission Deadline
            </div>
            <div
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: isExpired ? '#f87171' : '#fff',
                marginTop: '0.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Calendar size={15} color={isExpired ? '#f87171' : 'var(--primary)'} />
              {deadlineDate.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Technical Requirements & Details:
          </h4>
          <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>{rfq.description}</p>
        </div>
      </div>

      {/* Quotations Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MessageSquare size={20} color="var(--primary)" />
            <h2>Quotations Received ({quotations.length})</h2>
          </div>
        </div>

        {quotations.length === 0 ? (
          <EmptyState
            title="No quotations received yet"
            description="Your RFQ is visible in the supplier marketplace. Once verified vendors review your specifications, their quotations and pricing will appear right here."
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quotations.map((quote) => (
              <div
                key={quote._id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: '4px solid var(--primary)'
                }}
              >
                {/* Quote Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(6, 182, 212, 0.15)',
                        color: '#22d3ee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Building size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem' }}>
                        {quote.supplier?.companyName || 'Supplier'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Contact: {quote.supplier?.name} • Submitted on{' '}
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Quoted Price Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Quoted Total Price
                    </div>
                    <div
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        color: '#34d399',
                        letterSpacing: '-0.02em'
                      }}
                    >
                      ${quote.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>

                {/* Delivery Time and Message */}
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
                        color: '#a5b4fc',
                        fontWeight: 600,
                        marginBottom: '0.35rem'
                      }}
                    >
                      <Clock size={15} />
                      <span>Estimated Lead Time: {quote.estimatedDeliveryTime}</span>
                    </div>
                    <p style={{ fontSize: '0.925rem', whiteSpace: 'pre-line', lineHeight: 1.5 }}>
                      {quote.notes}
                    </p>
                  </div>

                  {/* Supplier Contact Info Box */}
                  <div
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      Supplier Details
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                      <Mail size={14} color="var(--text-muted)" />
                      <span>{quote.supplier?.email}</span>
                    </div>
                    {quote.supplier?.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                        <Phone size={14} color="var(--text-muted)" />
                        <span>{quote.supplier?.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

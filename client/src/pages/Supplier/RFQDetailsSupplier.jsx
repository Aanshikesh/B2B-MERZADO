import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { rfqService, quotationService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  LoadingSpinner,
  ErrorMessage,
  SuccessMessage,
  StatusBadge
} from '../../components/CommonUI';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Layers,
  Building,
  Send,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const RFQDetailsSupplier = () => {
  const { id } = useParams();
  const { isAuthenticated, isSupplier } = useAuth();

  const [rfq, setRfq] = useState(null);
  const [existingQuote, setExistingQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [price, setPrice] = useState('');
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('');
  const [notes, setNotes] = useState('');

  const fetchRFQDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await rfqService.getById(id);
      setRfq(data.rfq);

      if (data.myQuote) {
        setExistingQuote(data.myQuote);
        setPrice(data.myQuote.price);
        setEstimatedDeliveryTime(data.myQuote.estimatedDeliveryTime);
        setNotes(data.myQuote.notes);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load RFQ specifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRFQDetails();
  }, [id]);

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!price || !estimatedDeliveryTime || !notes) {
      setError('Please provide price, estimated delivery time, and notes.');
      return;
    }

    if (Number(price) <= 0) {
      setError('Quoted price must be greater than zero.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setSubmitting(true);

      const res = await quotationService.submit({
        rfqId: rfq._id,
        price: Number(price),
        estimatedDeliveryTime,
        notes
      });

      setExistingQuote(res.quotation);
      setSuccess(
        existingQuote
          ? 'Your quotation has been updated successfully!'
          : 'Quotation submitted successfully to the buyer!'
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quotation.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading requirement details..." />;
  }

  if (!rfq) {
    return (
      <div style={{ maxWidth: '720px', margin: '2rem auto' }}>
        <ErrorMessage message={error || 'Requirement not found.'} />
        <Link to="/marketplace" className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Marketplace</span>
        </Link>
      </div>
    );
  }

  const deadlineDate = new Date(rfq.deadline);
  const isExpired = deadlineDate < new Date();
  const isClosed = rfq.status === 'closed' || isExpired;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/marketplace" className="btn btn-outline btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Marketplace</span>
        </Link>
      </div>

      <ErrorMessage message={error} />
      <SuccessMessage message={success} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start'
        }}
      >
        {/* Left Column: Complete RFQ Specifications */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <StatusBadge status={isClosed ? 'closed' : 'open'} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Posted on {new Date(rfq.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>{rfq.title}</h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 0.85rem',
              background: 'var(--bg-surface-elevated)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              fontSize: '0.875rem'
            }}
          >
            <Building size={16} color="var(--primary)" />
            <span style={{ color: 'var(--text-secondary)' }}>Buyer Organization:</span>
            <strong style={{ color: '#fff' }}>{rfq.buyer?.companyName || 'Corporate Buyer'}</strong>
          </div>

          {/* Key Specs Table */}
          <div
            style={{
              background: 'var(--bg-surface-elevated)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Quantity Needed:</span>
              <strong style={{ color: '#fff' }}>
                {rfq.quantity.toLocaleString()} {rfq.unit || 'units'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Destination:</span>
              <span style={{ color: '#fff', textAlign: 'right' }}>{rfq.deliveryLocation}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Response Deadline:</span>
              <span style={{ color: isExpired ? '#f87171' : '#fff', fontWeight: 600 }}>
                {deadlineDate.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
                {isExpired && ' (Expired)'}
              </span>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Requirement Description & Technical Specs:
            </h4>
            <p style={{ whiteSpace: 'pre-line', lineHeight: 1.6, fontSize: '0.925rem' }}>
              {rfq.description}
            </p>
          </div>
        </div>

        {/* Right Column: Submit Quotation Form or Existing Quote Notice */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <DollarSign size={20} color="var(--primary)" />
            <h2>{existingQuote ? 'Your Submitted Quotation' : 'Submit a Quotation'}</h2>
          </div>

          {!isAuthenticated ? (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                background: 'var(--bg-surface-elevated)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <Lock size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
              <h3>Sign In to Quote</h3>
              <p style={{ fontSize: '0.875rem', margin: '0.5rem 0 1.25rem' }}>
                You must be logged in with a Supplier account to submit competitive pricing for this requirement.
              </p>
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In as Supplier
              </Link>
            </div>
          ) : !isSupplier ? (
            <div
              style={{
                padding: '1.25rem',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 600 }}>
                <AlertTriangle size={18} />
                <span>Buyer Account Active</span>
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
                You are currently signed in with a Buyer account. Only registered Suppliers can submit quotations on RFQs.
              </p>
            </div>
          ) : isClosed ? (
            <div
              style={{
                padding: '1.25rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', fontWeight: 600 }}>
                <AlertTriangle size={18} />
                <span>RFQ Closed / Deadline Expired</span>
              </div>
              <p style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
                This requirement is closed or the submission deadline has elapsed. Quotations are no longer being accepted.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote}>
              {existingQuote && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#34d399',
                    fontSize: '0.825rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>You have already quoted on this RFQ. You can update your bid below.</span>
                </div>
              )}

              {/* Price */}
              <div className="form-group">
                <label className="form-label">
                  Quoted Total Price (USD) <span className="req">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                      fontWeight: 600
                    }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className="form-control"
                    placeholder="e.g. 3500.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ paddingLeft: '2.25rem' }}
                    required
                  />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total cost including manufacturing/supply and applicable freight.
                </span>
              </div>

              {/* Delivery Time */}
              <div className="form-group">
                <label className="form-label">
                  Estimated Delivery Time <span className="req">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Clock
                    size={16}
                    color="var(--text-muted)"
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. 5 business days, 2 weeks"
                    value={estimatedDeliveryTime}
                    onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
                    style={{ paddingLeft: '2.5rem' }}
                    required
                  />
                </div>
              </div>

              {/* Notes / Message */}
              <div className="form-group">
                <label className="form-label">
                  Quotation Notes / Terms <span className="req">*</span>
                </label>
                <textarea
                  className="form-control"
                  placeholder="Specify payment terms, certifications (e.g. ISO/MTRs), freight terms, validity period, or warranty coverage..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={submitting}
              >
                <Send size={16} />
                <span>
                  {submitting
                    ? 'Submitting Quote...'
                    : existingQuote
                    ? 'Update My Quotation'
                    : 'Submit Quotation'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

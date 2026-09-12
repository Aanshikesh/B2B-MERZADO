import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rfqService } from '../../services/api';
import {
  LoadingSpinner,
  ErrorMessage,
  EmptyState,
  StatusBadge,
  StatCard
} from '../../components/CommonUI';
import {
  FilePlus,
  Layers,
  CheckCircle,
  Clock,
  MessageSquare,
  ArrowRight,
  Edit3,
  Calendar,
  MapPin
} from 'lucide-react';

export const BuyerDashboard = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMyRFQs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await rfqService.getMyRFQs();
      setRfqs(data.rfqs || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your RFQs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRFQs();
  }, []);

  // Compute metrics
  const totalRFQs = rfqs.length;
  const openRFQs = rfqs.filter((r) => r.status === 'open').length;
  const closedRFQs = rfqs.filter((r) => r.status === 'closed').length;
  const totalQuotesReceived = rfqs.reduce((acc, r) => acc + (r.quotationCount || 0), 0);

  const filteredRFQs = rfqs.filter((rfq) => {
    if (statusFilter === 'all') return true;
    return rfq.status === statusFilter;
  });

  return (
    <div>
      {/* Top Banner & Action */}
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
          <h1>Buyer Dashboard</h1>
          <p>Manage your business requirements and review supplier quotations</p>
        </div>
        <Link to="/buyer/create-rfq" className="btn btn-primary">
          <FilePlus size={18} />
          <span>Post New RFQ</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="stats-grid">
        <StatCard
          icon={Layers}
          color="indigo"
          value={totalRFQs}
          label="Total Posted RFQs"
        />
        <StatCard
          icon={Clock}
          color="cyan"
          value={openRFQs}
          label="Open Requirements"
        />
        <StatCard
          icon={CheckCircle}
          color="emerald"
          value={closedRFQs}
          label="Closed / Fulfilled"
        />
        <StatCard
          icon={MessageSquare}
          color="amber"
          value={totalQuotesReceived}
          label="Total Quotations Received"
        />
      </div>

      <ErrorMessage message={error} />

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <h2>Your Submitted RFQs ({filteredRFQs.length})</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'open', 'closed'].map((status) => (
            <button
              key={status}
              type="button"
              className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setStatusFilter(status)}
              style={{ textTransform: 'capitalize' }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your submitted RFQs..." />
      ) : filteredRFQs.length === 0 ? (
        <EmptyState
          title={statusFilter === 'all' ? 'No RFQs posted yet' : `No ${statusFilter} RFQs found`}
          description={
            statusFilter === 'all'
              ? 'Get started by creating your first Request for Quotation to receive supplier proposals.'
              : `You currently have no RFQs marked as ${statusFilter}.`
          }
          action={
            statusFilter === 'all' ? (
              <Link to="/buyer/create-rfq" className="btn btn-primary">
                <FilePlus size={16} />
                <span>Create Your First RFQ</span>
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Requirement Name</th>
                <th>Quantity</th>
                <th>Delivery Location</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Quotes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRFQs.map((rfq) => {
                const deadlineDate = new Date(rfq.deadline);
                const isExpired = deadlineDate < new Date() && rfq.status === 'open';

                return (
                  <tr key={rfq._id}>
                    <td>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{rfq.title}</div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-muted)',
                          maxWidth: '280px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {rfq.description}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{rfq.quantity.toLocaleString()}</span>{' '}
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {rfq.unit || 'units'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <MapPin size={14} color="var(--text-muted)" />
                        <span>{rfq.deliveryLocation}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        <span style={{ color: isExpired ? '#f87171' : 'inherit' }}>
                          {deadlineDate.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={rfq.status} />
                      {isExpired && (
                        <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '2px' }}>
                          (Deadline Passed)
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-full)',
                          background:
                            rfq.quotationCount > 0
                              ? 'rgba(99, 102, 241, 0.15)'
                              : 'rgba(255, 255, 255, 0.05)',
                          color: rfq.quotationCount > 0 ? '#818cf8' : 'var(--text-muted)',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      >
                        <MessageSquare size={13} />
                        {rfq.quotationCount || 0}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '0.5rem'
                        }}
                      >
                        <Link
                          to={`/buyer/edit-rfq/${rfq._id}`}
                          className="btn btn-outline btn-sm"
                          title="Edit RFQ"
                        >
                          <Edit3 size={14} />
                          <span>Edit</span>
                        </Link>
                        <Link
                          to={`/buyer/rfq/${rfq._id}`}
                          className="btn btn-primary btn-sm"
                          title="View Quotations"
                        >
                          <span>Review</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

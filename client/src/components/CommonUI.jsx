import React from 'react';
import { AlertCircle, CheckCircle2, Inbox } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading marketplace data...' }) => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{text}</p>
  </div>
);

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your criteria at the moment.',
  action = null
}) => (
  <div className="empty-state">
    <div className="empty-icon-box">
      <Icon size={28} />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
    {action}
  </div>
);

export const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="alert alert-error">
      <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>{message}</div>
    </div>
  );
};

export const SuccessMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="alert alert-success">
      <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>{message}</div>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase();
  let label = status;
  let className = 'status-badge';

  if (norm === 'open') {
    className += ' open';
    label = 'Open for Bids';
  } else if (norm === 'closed') {
    className += ' closed';
    label = 'Closed';
  } else if (norm === 'submitted') {
    className += ' submitted';
    label = 'Submitted';
  } else if (norm === 'accepted') {
    className += ' accepted';
    label = 'Accepted';
  } else {
    className += ' closed';
  }

  return <span className={className}>{label}</span>;
};

export const StatCard = ({ icon: Icon, color = 'indigo', value, label }) => (
  <div className="stat-card">
    <div className={`stat-icon ${color}`}>
      <Icon size={22} />
    </div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

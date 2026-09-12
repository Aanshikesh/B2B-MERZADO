import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { rfqService } from '../../services/api';
import { ErrorMessage, LoadingSpinner } from '../../components/CommonUI';
import { FilePlus, Edit3, ArrowLeft, Save } from 'lucide-react';

export const CreateEditRFQ = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    unit: 'pieces',
    deliveryLocation: '',
    deadline: '',
    status: 'open'
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchRFQ = async () => {
        try {
          setLoading(true);
          const data = await rfqService.getById(id);
          const rfq = data.rfq;

          // Format deadline to YYYY-MM-DD for input[type="date"]
          let formattedDeadline = '';
          if (rfq.deadline) {
            formattedDeadline = new Date(rfq.deadline).toISOString().split('T')[0];
          }

          setFormData({
            title: rfq.title || '',
            description: rfq.description || '',
            quantity: rfq.quantity || '',
            unit: rfq.unit || 'units',
            deliveryLocation: rfq.deliveryLocation || '',
            deadline: formattedDeadline,
            status: rfq.status || 'open'
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load RFQ details.');
        } finally {
          setLoading(false);
        }
      };

      fetchRFQ();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, quantity, deliveryLocation, deadline } = formData;

    if (!title || !description || !quantity || !deliveryLocation || !deadline) {
      setError('Please fill in all mandatory fields marked with *.');
      return;
    }

    if (Number(quantity) <= 0) {
      setError('Quantity must be a positive number greater than 0.');
      return;
    }

    try {
      setError('');
      setSaving(true);

      if (isEditing) {
        await rfqService.update(id, formData);
      } else {
        await rfqService.create(formData);
      }

      navigate('/buyer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save RFQ. Please check inputs.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading RFQ specifications..." />;
  }

  return (
    <div style={{ maxWidth: '720px', margin: '1rem auto' }}>
      {/* Back button */}
      <Link
        to="/buyer/dashboard"
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '1.5rem', display: 'inline-flex' }}
      >
        <ArrowLeft size={15} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isEditing ? <Edit3 size={22} /> : <FilePlus size={22} />}
          </div>
          <div>
            <h2>{isEditing ? 'Edit Business Requirement (RFQ)' : 'Post a New RFQ'}</h2>
            <p style={{ fontSize: '0.875rem' }}>
              {isEditing
                ? 'Update specifications, deadline, or status for this requirement'
                : 'Publish your procurement need to verified marketplace suppliers'}
            </p>
          </div>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>
          {/* Product / Service Name */}
          <div className="form-group">
            <label className="form-label">
              Product or Service Name <span className="req">*</span>
            </label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Industrial Grade Stainless Steel Screws (M6x20mm)"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Detailed Requirement Description */}
          <div className="form-group">
            <label className="form-label">
              Requirement Description & Technical Specs <span className="req">*</span>
            </label>
            <textarea
              name="description"
              className="form-control"
              placeholder="Provide exact technical requirements, standards (e.g. ISO, ASTM), material specifications, and any special packaging instructions..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          {/* Quantity & Unit Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Quantity Required <span className="req">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                step="1"
                className="form-control"
                placeholder="e.g. 5000"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure</label>
              <input
                type="text"
                name="unit"
                className="form-control"
                placeholder="e.g. pieces, kg, units, sheets, boxes"
                value={formData.unit}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Delivery Location & Deadline */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Delivery Location <span className="req">*</span>
              </label>
              <input
                type="text"
                name="deliveryLocation"
                className="form-control"
                placeholder="e.g. Chicago, IL (Distribution Hub B)"
                value={formData.deliveryLocation}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Response Deadline <span className="req">*</span>
              </label>
              <input
                type="date"
                name="deadline"
                className="form-control"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Status (when editing) */}
          {isEditing && (
            <div className="form-group">
              <label className="form-label">RFQ Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="open">Open (Accepting Quotations)</option>
                <option value="closed">Closed (No longer accepting quotations)</option>
              </select>
            </div>
          )}

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-color)'
            }}
          >
            <Link to="/buyer/dashboard" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish RFQ'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

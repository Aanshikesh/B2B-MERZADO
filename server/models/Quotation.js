const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema(
  {
    rfq: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RFQ',
      required: [true, 'Quotation must be linked to an RFQ']
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Quotation must have a supplier']
    },
    price: {
      type: Number,
      required: [true, 'Please provide a quoted price'],
      min: [0.01, 'Quoted price must be greater than 0']
    },
    estimatedDeliveryTime: {
      type: String,
      required: [true, 'Please provide estimated delivery time (e.g., 5 days, 2 weeks)'],
      trim: true
    },
    notes: {
      type: String,
      required: [true, 'Please provide quotation notes or terms'],
      trim: true
    },
    status: {
      type: String,
      enum: ['submitted', 'reviewed', 'accepted', 'declined'],
      default: 'submitted'
    }
  },
  {
    timestamps: true
  }
);

// Prevent a supplier from creating multiple duplicate quotations for the same RFQ (compound index)
quotationSchema.index({ rfq: 1, supplier: 1 }, { unique: true });

module.exports = mongoose.model('Quotation', quotationSchema);

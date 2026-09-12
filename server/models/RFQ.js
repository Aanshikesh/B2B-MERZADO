const mongoose = require('mongoose');

const rfqSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide the product or service name'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Please provide requirement details/specifications'],
      trim: true
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify the required quantity'],
      min: [1, 'Quantity must be at least 1']
    },
    unit: {
      type: String,
      default: 'units',
      trim: true
    },
    deliveryLocation: {
      type: String,
      required: [true, 'Please provide the delivery location / destination'],
      trim: true
    },
    deadline: {
      type: Date,
      required: [true, 'Please set a response deadline date']
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Index for search queries on title, description, and location
rfqSchema.index({ title: 'text', description: 'text', deliveryLocation: 'text' });

module.exports = mongoose.model('RFQ', rfqSchema);

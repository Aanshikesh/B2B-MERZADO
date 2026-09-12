const Quotation = require('../models/Quotation');
const RFQ = require('../models/RFQ');

// @desc    Submit or update a quotation for an RFQ
// @route   POST /api/quotations
// @access  Private (Supplier only)
const submitQuotation = async (req, res, next) => {
  try {
    const { rfqId, price, estimatedDeliveryTime, notes } = req.body;

    // Validate inputs
    if (!rfqId || !price || !estimatedDeliveryTime || !notes) {
      return res.status(400).json({
        success: false,
        message: 'Please provide RFQ ID, quoted price, estimated delivery time, and notes.'
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quoted price must be greater than zero.'
      });
    }

    // Check if RFQ exists
    const rfq = await RFQ.findById(rfqId);
    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: 'RFQ not found.'
      });
    }

    // Check if RFQ is open
    if (rfq.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'This RFQ is closed. Quotations cannot be submitted.'
      });
    }

    // Check if deadline has passed
    const now = new Date();
    if (new Date(rfq.deadline) < now) {
      return res.status(400).json({
        success: false,
        message: 'The deadline for this RFQ has expired.'
      });
    }

    // Check if supplier already submitted a quotation for this RFQ
    let quotation = await Quotation.findOne({
      rfq: rfqId,
      supplier: req.user._id
    });

    if (quotation) {
      // Update existing quotation
      quotation.price = Number(price);
      quotation.estimatedDeliveryTime = estimatedDeliveryTime;
      quotation.notes = notes;
      quotation.status = 'submitted';
      await quotation.save();

      return res.status(200).json({
        success: true,
        message: 'Your existing quotation has been updated successfully.',
        quotation
      });
    }

    // Create new quotation
    quotation = await Quotation.create({
      rfq: rfqId,
      supplier: req.user._id,
      price: Number(price),
      estimatedDeliveryTime,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Quotation submitted successfully.',
      quotation
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all quotations submitted by the logged-in supplier
// @route   GET /api/quotations/my
// @access  Private (Supplier only)
const getMyQuotations = async (req, res, next) => {
  try {
    const quotations = await Quotation.find({ supplier: req.user._id })
      .populate({
        path: 'rfq',
        select: 'title description quantity unit deliveryLocation deadline status',
        populate: {
          path: 'buyer',
          select: 'name companyName email'
        }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quotations.length,
      quotations
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all quotations received for a specific RFQ
// @route   GET /api/quotations/rfq/:rfqId
// @access  Private (Buyer only - must be RFQ owner)
const getQuotesForRFQ = async (req, res, next) => {
  try {
    const { rfqId } = req.params;

    const rfq = await RFQ.findById(rfqId);
    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: 'RFQ not found.'
      });
    }

    // Ensure only the buyer who owns the RFQ can view all quotes
    if (rfq.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view quotations for this RFQ.'
      });
    }

    const quotations = await Quotation.find({ rfq: rfqId })
      .populate('supplier', 'name companyName email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quotations.length,
      quotations
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  submitQuotation,
  getMyQuotations,
  getQuotesForRFQ
};

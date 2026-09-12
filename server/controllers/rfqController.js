const RFQ = require('../models/RFQ');
const Quotation = require('../models/Quotation');

// @desc    Create a new RFQ
// @route   POST /api/rfqs
// @access  Private (Buyer only)
const createRFQ = async (req, res, next) => {
  try {
    const { title, description, quantity, unit, deliveryLocation, deadline } = req.body;

    // Validate presence
    if (!title || !description || !quantity || !deliveryLocation || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, quantity, delivery location, and deadline.'
      });
    }

    // Validate quantity
    if (Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than zero.'
      });
    }

    // Validate deadline is a valid future date
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid deadline date.'
      });
    }

    // Create RFQ
    const rfq = await RFQ.create({
      title,
      description,
      quantity: Number(quantity),
      unit: unit || 'units',
      deliveryLocation,
      deadline: deadlineDate,
      buyer: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'RFQ created successfully',
      rfq
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all RFQs created by the logged-in buyer
// @route   GET /api/rfqs/my
// @access  Private (Buyer only)
const getMyRFQs = async (req, res, next) => {
  try {
    const rfqs = await RFQ.find({ buyer: req.user._id }).sort({ createdAt: -1 });

    // Include quotation counts for each RFQ
    const rfqIds = rfqs.map((r) => r._id);
    const quoteCounts = await Quotation.aggregate([
      { $match: { rfq: { $in: rfqIds } } },
      { $group: { _id: '$rfq', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    quoteCounts.forEach((q) => {
      countMap[q._id.toString()] = q.count;
    });

    const rfqsWithCounts = rfqs.map((rfq) => {
      const doc = rfq.toObject();
      doc.quotationCount = countMap[rfq._id.toString()] || 0;
      return doc;
    });

    res.status(200).json({
      success: true,
      count: rfqsWithCounts.length,
      rfqs: rfqsWithCounts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all RFQs (Marketplace for suppliers & browsing)
// @route   GET /api/rfqs
// @access  Public / Authenticated
const getAllRFQs = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const filter = {};

    // Filter by status (open, closed, or all)
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Search by title, description, or deliveryLocation
    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { deliveryLocation: regex }
      ];
    }

    const rfqs = await RFQ.find(filter)
      .populate('buyer', 'name companyName email')
      .sort({ createdAt: -1 });

    // Count quotes for each RFQ
    const rfqIds = rfqs.map((r) => r._id);
    const quoteCounts = await Quotation.aggregate([
      { $match: { rfq: { $in: rfqIds } } },
      { $group: { _id: '$rfq', count: { $sum: 1 } } }
    ]);

    const countMap = {};
    quoteCounts.forEach((q) => {
      countMap[q._id.toString()] = q.count;
    });

    const rfqsWithCounts = rfqs.map((rfq) => {
      const doc = rfq.toObject();
      doc.quotationCount = countMap[rfq._id.toString()] || 0;
      return doc;
    });

    res.status(200).json({
      success: true,
      count: rfqsWithCounts.length,
      rfqs: rfqsWithCounts
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single RFQ details
// @route   GET /api/rfqs/:id
// @access  Public / Authenticated
const getRFQById = async (req, res, next) => {
  try {
    const rfq = await RFQ.findById(req.params.id).populate('buyer', 'name companyName email phone');

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: 'RFQ not found'
      });
    }

    const responseData = {
      rfq: rfq.toObject()
    };

    // If user is authenticated
    if (req.user) {
      const isOwner = rfq.buyer._id.toString() === req.user._id.toString();

      if (isOwner) {
        // Buyer owner can see all quotations received
        const quotations = await Quotation.find({ rfq: rfq._id })
          .populate('supplier', 'name companyName email phone')
          .sort({ createdAt: -1 });
        responseData.quotations = quotations;
        responseData.isOwner = true;
      } else if (req.user.role === 'supplier') {
        // Supplier can see if they already submitted a quotation
        const myQuote = await Quotation.findOne({
          rfq: rfq._id,
          supplier: req.user._id
        });
        responseData.myQuote = myQuote;
      }
    }

    res.status(200).json({
      success: true,
      ...responseData
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update an existing RFQ
// @route   PUT /api/rfqs/:id
// @access  Private (Buyer only - must be owner)
const updateRFQ = async (req, res, next) => {
  try {
    let rfq = await RFQ.findById(req.params.id);

    if (!rfq) {
      return res.status(404).json({
        success: false,
        message: 'RFQ not found'
      });
    }

    // Verify ownership
    if (rfq.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this RFQ. You are not the owner.'
      });
    }

    const { title, description, quantity, unit, deliveryLocation, deadline, status } = req.body;

    if (quantity && Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than zero.'
      });
    }

    if (status && !['open', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either open or closed.'
      });
    }

    // Apply updates
    if (title) rfq.title = title;
    if (description) rfq.description = description;
    if (quantity) rfq.quantity = Number(quantity);
    if (unit) rfq.unit = unit;
    if (deliveryLocation) rfq.deliveryLocation = deliveryLocation;
    if (deadline) rfq.deadline = new Date(deadline);
    if (status) rfq.status = status;

    await rfq.save();

    res.status(200).json({
      success: true,
      message: 'RFQ updated successfully',
      rfq
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRFQ,
  getMyRFQs,
  getAllRFQs,
  getRFQById,
  updateRFQ
};

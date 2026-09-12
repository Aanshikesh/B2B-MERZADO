const express = require('express');
const router = express.Router();
const {
  createRFQ,
  getMyRFQs,
  getAllRFQs,
  getRFQById,
  updateRFQ
} = require('../controllers/rfqController');
const { protect, optionalAuth, authorize } = require('../middleware/authMiddleware');

// Marketplace list of RFQs (public/accessible to browse)
router.get('/', getAllRFQs);

// Buyer: get their own RFQs
router.get('/my', protect, authorize('buyer'), getMyRFQs);

// Buyer: create new RFQ
router.post('/', protect, authorize('buyer'), createRFQ);

// Get single RFQ details (optional auth so buyer/supplier gets their specific data)
router.get('/:id', optionalAuth, getRFQById);

// Buyer: update existing RFQ
router.put('/:id', protect, authorize('buyer'), updateRFQ);

module.exports = router;

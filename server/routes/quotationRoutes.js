const express = require('express');
const router = express.Router();
const {
  submitQuotation,
  getMyQuotations,
  getQuotesForRFQ
} = require('../controllers/quotationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Supplier: submit quotation
router.post('/', protect, authorize('supplier'), submitQuotation);

// Supplier: view submitted quotations
router.get('/my', protect, authorize('supplier'), getMyQuotations);

// Buyer: view quotations for a specific RFQ
router.get('/rfq/:rfqId', protect, authorize('buyer'), getQuotesForRFQ);

module.exports = router;

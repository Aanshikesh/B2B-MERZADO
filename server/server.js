const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Normalize Vercel rewritten URL parameters so routes match correctly in serverless
app.use((req, res, next) => {
  try {
    const urlObj = new URL(req.url, 'http://localhost');
    const vercelPath = urlObj.searchParams.get('_vercel_path');

    if (vercelPath) {
      urlObj.searchParams.delete('_vercel_path');
      const search = urlObj.search;
      const finalUrl = '/api/' + vercelPath + search;
      req.url = finalUrl;
      req.originalUrl = finalUrl;
      req._parsedUrl = null;
    }
  } catch (e) {
    // Continue
  }
  next();
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'B2B RFQ Marketplace API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Ensure DB connection for every request (especially on serverless cold starts)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Route Handlers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rfqs', require('./routes/rfqRoutes'));
app.use('/api/quotations', require('./routes/quotationRoutes'));

// Serve frontend static build files (for production & Vercel)
const path = require('path');
const fs = require('fs');

const possibleDistPaths = [
  path.join(process.cwd(), 'client/dist'),
  path.join(__dirname, '../client/dist'),
  path.join(__dirname, 'client/dist')
];

const distPath = possibleDistPaths.find((p) => fs.existsSync(p));

if (distPath) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 and Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only listen when run directly (not when imported by Vercel serverless)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;

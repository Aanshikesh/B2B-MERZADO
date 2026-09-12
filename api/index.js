const app = require('../server/server');

module.exports = (req, res) => {
  try {
    const urlObj = new URL(req.url, 'http://localhost');
    const vercelPath = urlObj.searchParams.get('_vercel_path');

    if (vercelPath) {
      urlObj.searchParams.delete('_vercel_path');
      const finalUrl = '/api/' + vercelPath + urlObj.search;
      req.url = finalUrl;
      req.originalUrl = finalUrl;
    } else if (req.headers['x-matched-path'] && req.headers['x-matched-path'].startsWith('/api')) {
      req.url = req.headers['x-matched-path'];
      req.originalUrl = req.headers['x-matched-path'];
    }
  } catch (e) {
    // Continue with existing URL if parsing fails
  }

  return app(req, res);
};

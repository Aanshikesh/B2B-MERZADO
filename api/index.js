const app = require('../server/server');

module.exports = (req, res) => {
  // If Vercel rewrote the URL to /api/index.js, restore the original incoming path
  const matchedPath = req.headers['x-matched-path'];
  const vercelPath = req.query?._vercel_path;

  if (matchedPath && matchedPath.startsWith('/api')) {
    req.url = matchedPath;
  } else if (vercelPath) {
    req.url = '/api/' + vercelPath;
  }

  return app(req, res);
};

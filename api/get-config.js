const { list } = require('@vercel/blob');
const cors = require('./_cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blobs } = await list({ prefix: 'config.json' });
    if (blobs.length === 0) {
      return res.json({ protectionEnabled: true });
    }

    const response = await fetch(blobs[0].url);
    const config = await response.json();
    return res.json({ protectionEnabled: config.protectionEnabled ?? true });
  } catch (err) {
    console.error('get-config error:', err);
    return res.json({ protectionEnabled: true });
  }
};

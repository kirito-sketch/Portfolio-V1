const crypto = require('crypto');
const { put } = require('@vercel/blob');
const cors = require('./_cors');

function verifyToken(token, adminPassword) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    const { payload, hmac } = decoded;
    const expected = crypto.createHmac('sha256', adminPassword).update(payload).digest('hex');
    if (hmac !== expected) return false;
    const expires = parseInt(payload.split(':')[1], 10);
    return Date.now() < expires;
  } catch {
    return false;
  }
}

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin not configured' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!verifyToken(token, adminPassword)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const contentType = req.headers['content-type'] || '';
    if (!contentType.includes('application/pdf')) {
      return res.status(400).json({ error: 'Only PDF files are accepted' });
    }

    // Check size (10MB max)
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (contentLength > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large (max 10MB)' });
    }

    const blob = await put('resume.pdf', req.body, {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/pdf',
    });

    return res.json({ success: true, url: blob.url });
  } catch (err) {
    console.error('upload-resume error:', err);
    return res.status(500).json({ error: 'Failed to upload resume' });
  }
};

// Vercel needs raw body for binary uploads
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

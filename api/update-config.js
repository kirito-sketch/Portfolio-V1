const crypto = require('crypto');
const { put, list } = require('@vercel/blob');

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
    // Read existing config
    let config = { protectionEnabled: true, csPassword: 'arunperi' };
    try {
      const { blobs } = await list({ prefix: 'config.json' });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        config = await response.json();
      }
    } catch (e) {
      // Use defaults
    }

    // Merge updates
    const updates = req.body;
    if (typeof updates.protectionEnabled === 'boolean') {
      config.protectionEnabled = updates.protectionEnabled;
    }
    if (typeof updates.csPassword === 'string' && updates.csPassword.length > 0) {
      config.csPassword = updates.csPassword;
    }

    // Write config
    await put('config.json', JSON.stringify(config), {
      access: 'public',
      addRandomSuffix: false,
    });

    return res.json({ success: true, config: { protectionEnabled: config.protectionEnabled } });
  } catch (err) {
    console.error('update-config error:', err);
    return res.status(500).json({ error: 'Failed to update config' });
  }
};

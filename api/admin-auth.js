const crypto = require('crypto');

function createToken(adminPassword) {
  const expires = Date.now() + 4 * 60 * 60 * 1000; // 4 hours
  const payload = `admin:${expires}`;
  const hmac = crypto.createHmac('sha256', adminPassword).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ payload, hmac })).toString('base64');
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return res.status(500).json({ error: 'Admin not configured' });
  }

  const { password } = req.body;
  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = createToken(adminPassword);
  return res.json({ token });
};

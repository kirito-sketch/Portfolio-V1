const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ valid: false });
    }

    // Get stored password from config, fall back to env var
    let storedPassword = process.env.CS_PASSWORD || 'arunperi';

    try {
      const { blobs } = await list({ prefix: 'config.json' });
      if (blobs.length > 0) {
        const response = await fetch(blobs[0].url);
        const config = await response.json();
        if (config.csPassword) {
          storedPassword = config.csPassword;
        }
      }
    } catch (e) {
      // Fall back to env/default
    }

    const valid = password === storedPassword;
    return res.json({ valid });
  } catch (err) {
    console.error('validate-pw error:', err);
    return res.status(500).json({ valid: false });
  }
};

const { list } = require('@vercel/blob');
const path = require('path');
const fs = require('fs');
const cors = require('./_cors');

module.exports = async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Try to serve from Blob storage first
    const { blobs } = await list({ prefix: 'resume.pdf' });
    if (blobs.length > 0) {
      const blobUrl = blobs[0].url;
      const response = await fetch(blobUrl);
      if (response.ok) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="Arun Peri Resume.pdf"');
        const buffer = Buffer.from(await response.arrayBuffer());
        return res.send(buffer);
      }
    }
  } catch (err) {
    console.error('Blob resume fetch failed, falling back to static:', err);
  }

  // Fallback to static file
  const staticPath = path.join(process.cwd(), 'assets', 'Arun Peri Resume.pdf');
  if (fs.existsSync(staticPath)) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="Arun Peri Resume.pdf"');
    const fileBuffer = fs.readFileSync(staticPath);
    return res.send(fileBuffer);
  }

  return res.status(404).json({ error: 'Resume not found' });
};

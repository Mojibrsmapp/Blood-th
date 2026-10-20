import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Default to Port 1000 as configured for VPS deployment
const PORT = parseInt(process.env.PORT || '1000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const GOOGLE_VERIFICATION_TAG_1 = '<meta name="google-site-verification" content="p_NKsy5KQ2aPXLr90x7fdrjRX-SI1z1RnvfM7ltV6yw" />';
const GOOGLE_VERIFICATION_TAG_2 = '<meta name="google-site-verification" content="5P7zC2yOvXIgMqFEPjRWuFncBTSvifMC3y_uXz5yjdQ" />';
const GOOGLE_VERIFICATION_TAGS = `${GOOGLE_VERIFICATION_TAG_1}\n    ${GOOGLE_VERIFICATION_TAG_2}`;

const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

// Middleware to parse JSON payloads if needed for future API endpoints
app.use(express.json());

// Health check endpoint for VPS uptime monitors and load balancers
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'TotthoHub Blood',
    port: PORT,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Endpoint to check BBMS CSV status
app.get('/api/admin/csv-status', (req, res) => {
  const csvFile = path.join(__dirname, 'bbms_donors_backup_24700.csv');
  const exists = fs.existsSync(csvFile);
  let size = 0;
  if (exists) {
    try {
      size = fs.statSync(csvFile).size;
    } catch {}
  }
  res.json({
    fileName: 'bbms_donors_backup_24700.csv',
    exists,
    sizeBytes: size,
    sizeMB: (size / (1024 * 1024)).toFixed(2),
    path: csvFile
  });
});

// API Endpoint to get donors count & statistics
app.get('/api/donors/stats', (req, res) => {
  const jsonPath = path.join(__dirname, 'public', 'data', 'donors.json');
  const fallbackPath = path.join(__dirname, 'src', 'data', 'tursoImportedDonors.json');
  let donors = [];
  try {
    if (fs.existsSync(jsonPath)) {
      donors = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } else if (fs.existsSync(fallbackPath)) {
      donors = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
    }
  } catch {}
  
  res.json({
    totalDonors: donors.length,
    active: donors.filter(d => d.availability === 'available').length,
    groups: donors.reduce((acc, d) => {
      acc[d.bloodGroup] = (acc[d.bloodGroup] || 0) + 1;
      return acc;
    }, {})
  });
});

// Direct Google Search Console HTML File verification route fallback
app.get('/google:hash.html', (req, res) => {
  const fileName = `google${req.params.hash}.html`;
  const filePath = path.join(distPath, fileName);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`google-site-verification: ${fileName}`);
});

// Helper to serve index.html with guaranteed Google Search Console verification meta tag
function sendVerifiedIndexHtml(res) {
  try {
    if (!fs.existsSync(indexHtmlPath)) {
      throw new Error('dist/index.html not found');
    }

    let html = fs.readFileSync(indexHtmlPath, 'utf8');

    // Guarantee both verification meta tags are present in <head>
    if (!html.includes('p_NKsy5KQ2aPXLr90x7fdrjRX-SI1z1RnvfM7ltV6yw')) {
      html = html.replace('<head>', `<head>\n    ${GOOGLE_VERIFICATION_TAG_1}`);
    }
    if (!html.includes('5P7zC2yOvXIgMqFEPjRWuFncBTSvifMC3y_uXz5yjdQ')) {
      html = html.replace('<head>', `<head>\n    ${GOOGLE_VERIFICATION_TAG_2}`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.send(html);
  } catch {
    return res.sendFile(indexHtmlPath);
  }
}

// Check if production build exists
if (fs.existsSync(distPath)) {
  // Explicit route for root URL to guarantee verified HTML delivery
  app.get('/', (req, res) => {
    sendVerifiedIndexHtml(res);
  });

  // Serve static assets with caching headers
  app.use(
    express.static(distPath, {
      maxAge: '1d',
      index: false, // Handle index.html via our verified handler
      setHeaders: (res, filePath) => {
        // Assets with content hashes can be cached aggressively
        if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('robots.txt') || filePath.endsWith('sitemap.xml')) {
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }
      },
    })
  );

  // Fallback for Single Page Application client-side routing (React Router)
  app.get('*', (req, res) => {
    sendVerifiedIndexHtml(res);
  });
} else {
  // Informative fallback in case build has not been run yet
  app.get('*', (req, res) => {
    res.status(503).send(`
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        ${GOOGLE_VERIFICATION_TAGS}
        <title>TotthoHub Blood - Build Required</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; text-align: center; padding: 50px; background: #fff5f5; color: #1e293b; }
          .card { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); border: 1px solid #fee2e2; }
          h1 { color: #e11d48; margin-top: 0; font-size: 22px; }
          code { background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-weight: bold; color: #0f172a; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>প্রোডাকশন বিল্ড প্রয়োজন (Build Required)</h1>
          <p>সার্ভার পোর্ট <strong>${PORT}</strong> এ চালু আছে, কিন্তু <code>dist/</code> ফোল্ডারটি এখনও তৈরি হয়নি।</p>
          <p>আপনার VPS সার্ভারে নিচের কমান্ডটি রান করুন:</p>
          <p><code>npm run build</code></p>
        </div>
      </body>
      </html>
    `);
  });
}

const server = app.listen(PORT, HOST, () => {
  console.log('----------------------------------------------------');
  console.log(`🚀 TotthoHub Blood Server is LIVE!`);
  console.log(`🌐 VPS Port      : ${PORT}`);
  console.log(`📡 Host          : ${HOST}`);
  console.log(`🔗 Local URL     : http://localhost:${PORT}`);
  console.log(`🩺 Health Check  : http://localhost:${PORT}/api/health`);
  console.log('----------------------------------------------------');
});

// Graceful shutdown handling for PM2, Docker, or systemd
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  // Force exit after 10 seconds if hanging
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

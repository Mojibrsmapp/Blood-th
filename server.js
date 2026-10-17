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

const distPath = path.join(__dirname, 'dist');

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

// Check if production build exists
if (fs.existsSync(distPath)) {
  // Serve static assets with caching headers
  app.use(
    express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        // Assets with content hashes can be cached aggressively
        if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        }
      },
    })
  );

  // Fallback for Single Page Application client-side routing (React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Informative fallback in case build has not been run yet
  app.get('*', (req, res) => {
    res.status(503).send(`
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
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

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function createServiceProxy(target, pathRewrite = {}) {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite,
        timeout: 5000, // temps max pour que client reçoive une réponse
        proxyTimeout: 5000, // temps max pour que backend réponde
        onProxyReq(proxyReq, req, res) {
            const start = Date.now();
            console.log(`[GW] ${req.method} ${req.originalUrl} → ${target}${req.url} [START]`);
          
            res.on('finish', () => {
              const duration = Date.now() - start;
              console.log(`[GW] ${req.method} ${req.originalUrl} [DONE in ${duration}ms]`);
            });
          },
        onError(err, req, res) {
          console.error('[GW] Proxy error:', err.message);
          res.status(500).json({ error: 'Erreur proxy' });
        }
      });
      
};

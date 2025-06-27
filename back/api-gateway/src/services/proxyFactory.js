const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function createServiceProxy(target, pathRewrite = {}) {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite,
        timeout: 5000, // temps max pour que client reçoive une réponse
        proxyTimeout: 5000, // temps max pour que backend réponde
        selfHandleResponse: false,

        onProxyReq(proxyReq, req, res) {
            const start = Date.now();
            console.log(`[GW] ${req.method} ${req.originalUrl} → ${target}${req.url} [START]`);

            // S'assurer que le body est bien transmis (pour Swagger + POST/PUT/PATCH)
            if (
              req.method === 'POST' || 
              req.method === 'PUT' || 
              req.method === 'PATCH'
            ) {
              const bodyData = JSON.stringify(req.body || {});
              if (bodyData && bodyData !== '{}') {
                proxyReq.setHeader('Content-Type', 'application/json');
                proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                proxyReq.write(bodyData);
              }
            }
          
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

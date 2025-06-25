// src/app.js
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const compression = require('compression');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const { Connection, Client } = require('@temporalio/client');
const authMiddleware = require('./middlewares/auth.middleware');
const proxyRoutes = require('./routes/proxy.routes');

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  app.use(compression());
  app.use(express.json());

  // Swagger
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Temporal connection
  const connection = await Connection.connect({ address: 'localhost:7233' });
  const temporalClient = new Client({ connection });

  // Routes
  app.post('/register', async (req, res) => {
    try {
      const { name, email, password, location_id, culture_ids } = req.body;

      const handle = await temporalClient.workflow.start('registerWorkflow', {
        args: [{ name, email, password, location_id, culture_ids }],
        taskQueue: 'default',
        workflowId: `register-${Date.now()}`
      });

      const result = await handle.result();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      const handle = await temporalClient.workflow.start('loginWorkflow', {
        args: [{ email, password }],
        taskQueue: 'default',
        workflowId: `login-${Date.now()}`
      });

      const result = await handle.result();
      res.json(result);
    } catch (err) {
      res.status(401).json({ error: 'Login failed', detail: err.message });
    }
  });

  app.get('/info', async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      const handle = await temporalClient.workflow.start('getAllInfoWorkflow', {
        args: [{ token }],
        taskQueue: 'default',
        workflowId: `info-${Date.now()}`
      });

      const result = await handle.result();
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/daily', async (req, res) => {
    try {
      const handle = await temporalClient.workflow.start('dailyWorker', {
        args: [],
        taskQueue: 'default',
        workflowId: `daily-${Date.now()}`
      });

      await handle.result();
      res.json({ message: 'Daily job executed' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Fallback proxy
  app.use('/', proxyRoutes);

  // Start server
  app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Erreur API Gateway :', err);
  process.exit(1);
});

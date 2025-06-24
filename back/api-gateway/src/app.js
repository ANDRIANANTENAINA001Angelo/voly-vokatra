const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const authMiddleware = require('./middlewares/auth.middleware');
const proxyRoutes = require('./routes/proxy.routes');
const compression = require('compression');

app.use(compression());
// app.use(express.json());
// app.use(authMiddleware);
app.use('/', proxyRoutes);

app.listen(process.env.PORT, () => {
  console.log(`API Gateway running on port ${process.env.PORT}`);
});

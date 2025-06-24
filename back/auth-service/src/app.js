const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/auth/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Auth service running on port ${PORT}`));



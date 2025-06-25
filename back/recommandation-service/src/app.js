const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const recommandationRoutes = require('./routes/recommandation.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/recommandation', recommandationRoutes);
app.use('/recommandation/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.listen(process.env.PORT || 3006, () => {
  console.log(`Recommandation service en marche sur ${process.env.PORT || 3006}`);
});



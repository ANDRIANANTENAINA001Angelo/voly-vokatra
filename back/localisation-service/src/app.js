// localisation-service/src/app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const localisationRoutes = require('./routes/localisation.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');
const cors = require('cors');


dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());

app.use('/localisation', localisationRoutes);
app.use('/localisation/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const PORT = process.env.PORT || 3004
app.listen(PORT, () => {
  console.log(`Localisation service démarré sur le port ${PORT}`);
});


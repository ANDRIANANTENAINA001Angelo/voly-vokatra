require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');
const meteoRoutes = require('./routes/meteo.routes');


const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

connectDB();

app.use('/meteo', meteoRoutes);
app.use('/meteo/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.listen(port, () => {
  console.log(`Meteo service démarré sur le port ${port}`);
});

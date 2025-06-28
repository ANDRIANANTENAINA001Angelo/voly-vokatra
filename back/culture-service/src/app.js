const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cultureRoutes = require('./routes/culture.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');
const cors = require('cors');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/cultures', cultureRoutes);
app.use("/cultures/docs",swaggerUi.serve, swaggerUi.setup(swaggerDoc))


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Culture service démarré sur le port ${PORT}`);
});


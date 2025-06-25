require('dotenv').config();
const express = require('express');
const routes = require('./routes/notification.routes');
const connectDB = require("./config/db")
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./docs/swagger.json');


const app = express();
const PORT = process.env.PORT || 3005

app.use(express.json());

connectDB();

app.use('/notifications', routes);
app.use("/notifications/docs",swaggerUi.serve,swaggerUi.setup(swaggerDoc));

app.listen(PORT, () => {
  console.log(`Notification service démarré sur le port ${PORT}`);
});




// Dans index.js de l'API Gateway
const cron = require('node-cron');
const axios = require('axios');

cron.schedule('0 6 * * *', async () => {
  try {
    console.log('[CRON] DailyWorker lancé automatiquement à 6h...');
    const res = await axios.get('http://localhost:' + process.env.PORT + '/daily');
    console.log('[CRON] Résultat:', res.data);
  } catch (err) {
    console.error('[CRON] Erreur lors de l’appel à /daily:', err.message);
  }
});

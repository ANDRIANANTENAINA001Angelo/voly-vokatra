const { Worker } = require('@temporalio/worker');
const path = require('path');
require('dotenv').config();

async function runWorker() {
  const worker = await Worker.create({
    workflowsPath: require.resolve('./workflows/addCultureWorkflow'),
    activities: {
      ...require('./activities/fetchForecast'),
      ...require('./activities/sendNotification'),
      ...require('./activities/getUserCultures'),
      ...require('./activities/generateRecommendation')
    },
    taskQueue: 'default'
  });
  await worker.run();
  console.log('👷 Worker Temporal démarré sur la queue idm-queue');
}

runWorker().catch(console.error);



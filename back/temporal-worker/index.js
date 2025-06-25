const { Worker } = require('@temporalio/worker');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function run() {
  const activities = {};
  const activitiesPath = path.resolve(__dirname, 'activities');

  for (const file of fs.readdirSync(activitiesPath)) {
    const act = require(path.join(activitiesPath, file));
    Object.assign(activities, act);
  }

  const workflowsPath = require.resolve('./workflows/index.js'); // <---- fichier index

  const worker = await Worker.create({
    workflowsPath,
    activities,
    taskQueue: 'default',
  });

  await worker.run();
}

run().catch((err) => {
  console.error('Worker failed:', err);
  process.exit(1);
});

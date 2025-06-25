const { Connection, Client } = require('@temporalio/client');
const { v4: uuidv4 } = require('uuid');

async function run() {
  const connection = await Connection.connect();
  const client = new Client({ connection });

  const result = await client.workflow.start('addCultureWorkflow', {
    taskQueue: 'default',
    workflowId: 'add-culture-' + uuidv4(),
    args: [{
      user_id: '685b6af21d38d11ecc92f116', // andry (seeder)
      culture_id: '685b6af11d38d11ecc92f10e',// maïs (seeder)
      location_id: '685b6af01d38d11ecc92f108', // ville ambatolampy du région vakinakaratra  (seeder)
      date: new Date().toISOString()
    }],
  });

  console.log('✅ Workflow lancé avec succès:', result.workflowId);
}

run().catch(console.error);


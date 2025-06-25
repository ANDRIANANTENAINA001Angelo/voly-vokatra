// temporal-worker/workflows/index.js
const { registerWorkflow } = require('./registerWorkflow');
const { loginWorkflow } = require('./loginWorkflow');
const { getAllInfoWorkflow } = require('./getAllInfoWorkflow');
const { dailyWorker } = require('./dailyWorker');

module.exports = {
  registerWorkflow,
  loginWorkflow,
  getAllInfoWorkflow,
  dailyWorker
};



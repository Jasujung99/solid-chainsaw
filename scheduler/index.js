const cron = require('node-cron');
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const MAX_RETRIES = 3;

function logError(message, err) {
  const log = `${new Date().toISOString()} ${message} ${err?.stack || err}\n`;
  fs.appendFile('scheduler-error.log', log, () => {});
}

async function callModel(prompt) {
  const res = await fetch('http://localhost:3000/model', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  return data.result;
}

async function processExperiment(exp) {
  await pool.query('UPDATE prompts SET status = $1 WHERE id = $2', ['processing', exp.id]);
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await callModel(exp.prompt);
      await pool.query('UPDATE prompts SET result = $1, status = $2 WHERE id = $3', [result, 'completed', exp.id]);
      return;
    } catch (err) {
      console.error(`Attempt ${attempt} failed for experiment ${exp.id}:`, err);
      logError(`Experiment ${exp.id} attempt ${attempt} failed`, err);
      if (attempt === MAX_RETRIES) {
        await pool.query('UPDATE prompts SET status = $1 WHERE id = $2', ['failed', exp.id]);
      }
    }
  }
}

async function run() {
  try {
    const { rows } = await pool.query("SELECT id, prompt FROM prompts WHERE status = 'pending'");
    for (const exp of rows) {
      await processExperiment(exp);
    }
  } catch (err) {
    console.error('Scheduler run error:', err);
    logError('Scheduler run error', err);
  }
}

cron.schedule('* * * * *', run);

if (require.main === module) {
  run();
}

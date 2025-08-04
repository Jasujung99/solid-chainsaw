const fs = require('fs');
const path = require('path');

// simple .env loader
(function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const [, key, value] = match;
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
})();

const registry = {};

function loadModels() {
  const modelsDir = __dirname;
  const categories = fs.readdirSync(modelsDir, { withFileTypes: true }).filter(d => d.isDirectory());
  for (const category of categories) {
    const categoryDir = path.join(modelsDir, category.name);
    const files = fs.readdirSync(categoryDir);
    for (const file of files) {
      if (file.endsWith('.js')) {
        const mod = require(path.join(categoryDir, file));
        const ModelClass = mod.default || mod;
        if (typeof ModelClass === 'function') {
          const name = `${category.name}/${path.basename(file, '.js')}`;
          registry[name] = ModelClass;
        }
      }
    }
  }
}

function getModel(name) {
  const ModelClass = registry[name];
  if (!ModelClass) throw new Error(`Model ${name} not found`);
  return new ModelClass();
}

function listModels() {
  return Object.keys(registry);
}

module.exports = { loadModels, getModel, listModels };

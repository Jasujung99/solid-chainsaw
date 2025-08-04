const { loadModels, listModels } = require('./registry');

loadModels();
console.log('available models:', listModels());

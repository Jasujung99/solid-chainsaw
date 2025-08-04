const { BaseModel } = require('../base');

class OpenAITextModel extends BaseModel {
  constructor() {
    super(process.env.TEXT_MODEL_API_KEY || '', process.env.TEXT_MODEL_ENDPOINT || '');
  }

  async generate(params) {
    try {
      return await super.generate(params);
    } catch (err) {
      throw new Error(`Text model failed: ${err.message}`);
    }
  }
}

module.exports = OpenAITextModel;
module.exports.default = OpenAITextModel;

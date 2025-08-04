const { BaseModel } = require('../base');

class StableDiffusionImageModel extends BaseModel {
  constructor() {
    super(process.env.IMAGE_MODEL_API_KEY || '', process.env.IMAGE_MODEL_ENDPOINT || '');
  }

  async generate(params) {
    try {
      return await super.generate(params);
    } catch (err) {
      throw new Error(`Image model failed: ${err.message}`);
    }
  }
}

module.exports = StableDiffusionImageModel;
module.exports.default = StableDiffusionImageModel;

const { BaseModel } = require('../base');

class SpeechAudioModel extends BaseModel {
  constructor() {
    super(process.env.AUDIO_MODEL_API_KEY || '', process.env.AUDIO_MODEL_ENDPOINT || '');
  }

  async generate(params) {
    try {
      return await super.generate(params);
    } catch (err) {
      throw new Error(`Audio model failed: ${err.message}`);
    }
  }
}

module.exports = SpeechAudioModel;
module.exports.default = SpeechAudioModel;

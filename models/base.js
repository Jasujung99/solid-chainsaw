/**
 * @typedef {Object<string, any>} GenerateParams
 * @typedef {Object<string, any>} Output
 *
 * @interface Model
 * @function generate
 * @param {GenerateParams} params
 * @returns {Promise<Output>}
 */

/**
 * BaseModel provides a generic request handler with timeout and error handling.
 */
class BaseModel {
  constructor(apiKey, endpoint, timeout = Number(process.env.REQUEST_TIMEOUT) || 5000) {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
    this.timeout = timeout;
  }

  /**
   * @param {GenerateParams} params
   * @returns {Promise<Output>}
   */
  async generate(params) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(params),
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      throw new Error(err.message || 'Unknown error');
    } finally {
      clearTimeout(timer);
    }
  }
}

module.exports = { BaseModel };

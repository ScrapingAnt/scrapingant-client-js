const constants = require('./constants');
const { base64encode } = require('./utils');

class ScrapingClient {
    /**
     * @param {object} options
     * @param {HttpClient} options.httpClient
     * @param {string} options.apiKey
     */
    constructor(options) {
        const {
            httpClient,
            apiKey,
        } = options;

        this.httpClient = httpClient;
        this.apiKey = apiKey;
    }

    /**
     * @param {string} url
     * @param {object} [parameters]
     * @param {string} [parameters.cookies]
     * @param {string} [parameters.js_snippet]
     * @param {string} [parameters.proxy_country]
     * @param {boolean} [parameters.return_text]
     */
    async call(url, parameters = {}) {
        const response = await this.httpClient.call({
            url: `${constants.baseUrl}/v1/general`,
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': this.apiKey,
            },
            data: {
                url,
                ...(parameters.cookies && { cookies: parameters.cookies }),
                ...(parameters.js_snippet && { js_snippet: base64encode(parameters.js_snippet) }),
                ...(parameters.proxy_country && { proxy_country: parameters.proxy_country }),
                ...(parameters.return_text && { return_text: true }),
            },
        });

        return response.data;
    }
}

module.exports = ScrapingClient;

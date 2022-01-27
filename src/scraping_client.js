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
     * @param {boolean} [parameters.browser]
     * @param {string} [parameters.cookies]
     * @param {object} [parameters.headers]
     * @param {string} [parameters.js_snippet]
     * @param {string} [parameters.proxy_type] 'datacenter' or 'residential'
     * @param {string} [parameters.proxy_country]
     * @param {string} [parameters.wait_for_selector]
     * @param {boolean} [parameters.return_text]
     */
    async call(url, parameters = {}) {
        const transformedHeaders = parameters.headers && typeof parameters.headers === 'object'
            ? this._transformCustomHeaders(parameters.headers)
            : {};

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
        };

        const headers = Object.assign(defaultHeaders, transformedHeaders);
        const response = await this.httpClient.call({
            url: `${constants.baseUrl}/v1/general`,
            method: 'post',
            headers,
            data: {
                url,
                ...(typeof parameters.browser !== 'undefined' && { browser: !!parameters.browser }),
                ...(parameters.cookies && { cookies: parameters.cookies }),
                ...(parameters.js_snippet && { js_snippet: base64encode(parameters.js_snippet) }),
                ...(parameters.proxy_type && { proxy_type: parameters.proxy_type }),
                ...(parameters.proxy_country && { proxy_country: parameters.proxy_country }),
                ...(parameters.wait_for_selector && { wait_for_selector: parameters.wait_for_selector }),
                ...(parameters.return_text && { return_text: true }),
            },
        });

        return response.data;
    }

    _transformCustomHeaders(headers = {}) {
        const returnHeaders = {};

        Object.keys(headers).forEach((key) => {
            returnHeaders[`ant-${key}`] = headers[key];
        });

        return returnHeaders;
    }
}

module.exports = ScrapingClient;

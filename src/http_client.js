const retry = require('async-retry');
const axios = require('axios').default;
const os = require('os');
const ScrapingAntApiError = require('./scrapingant_api_error');
const { isNode } = require('./utils');
const { version } = require('../package.json');

class HttpClient {
    /**
     * @param {object} options
     * @param {number} options.maxRetries
     * @param {number} options.minDelayBetweenRetriesMillis
     * @param {number} options.timeoutSecs
     */
    constructor(options) {
        this.maxRetries = options.maxRetries;
        this.minDelayBetwenRetriesMillis = options.minDelayBetweenRetriesMillis;

        this.axios = axios.create({
            headers: {
                Accept: 'application/json, */*',
            },
            timeout: options.timeoutSecs * 1000,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        this.axios.defaults.headers = {};

        if (isNode()) {
            // Works only in Node. Cannot be set in browser
            this.axios.defaults.headers['User-Agent'] = `ScrapingAnt Client/${version} (${os.type()}; Node/${process.version});`;
        }
    }

    /**
     * @param {object} config
     * @return {Promise<*>}
     */
    async call(config) {
        const makeRequest = this._createRequestHandler(config);

        return retry(makeRequest, {
            retries: this.maxRetries,
            minTimeout: this.minDelayBetwenRetriesMillis,
        });
    }

    /**
     * Successful responses are returned, errors and unsuccessful
     * status codes are retried. See the following functions for the
     * retrying logic.
     * @param config
     * @return {function}
     * @private
     */
    _createRequestHandler(config) {
        /**
         * @param {function} stopTrying
         * @param {number} attempt
         * @return {?Promise<AxiosResponse<any>>}
         * @private
         */
        const makeRequest = async (stopTrying) => {
            let response;
            try {
                response = await this.axios.request(config);
                if (this._isStatusOk(response.status)) return response;
            } catch (err) {
                if (this._isNetworkError(err)) {
                    throw err;
                } else {
                    const apiError = new ScrapingAntApiError(err.response);

                    if (this._isStatusCodeRetryable(err.response.status)) {
                        throw apiError;
                    } else {
                        return stopTrying(apiError);
                    }
                }
            }
        };
        return makeRequest;
    }

    /*

    /**
     * When a network request is attempted by axios and fails,
     * it throws an AxiosError, which will can be checked by response
     * and isAxiosError property
     *
     * @param {Error} err
     * @return {boolean}
     * @private
     */
    _isNetworkError(err) {
        return !!err.isAxiosError && !err.response;
    }

    /**
     * We retry a 500+ only.
     * @param {number} statusCode
     * @return {boolean}
     * @private
     */
    _isStatusCodeRetryable(statusCode) {
        return statusCode >= 500;
    }

    /**
     * @param {number} statusCode
     * @return {boolean}
     * @private
     */
    _isStatusOk(statusCode) {
        return statusCode < 300;
    }
}

module.exports = HttpClient;

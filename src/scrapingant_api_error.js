class ScrapingAntApiError extends Error {
    /**
     * @param {AxiosResponse} response
     */
    constructor(response) {
        let message;
        if (response.data && response.data.detail) {
            message = response.data.detail;
        } else if (response.data) {
            let dataString;
            try {
                dataString = JSON.stringify(response.data, null, 2);
            } catch (err) {
                dataString = `${response.data}`;
            }
            message = `Unexpected error: ${dataString}`;
        }
        super(message);

        this.name = this.constructor.name;
        this.statusCode = response.status;
        this.httpMethod = response.config && response.config.method;
    }
}

module.exports = ScrapingAntApiError;

# ScrapingAnt API client for JavaScript
`@scrapingant/scrapingant-client` is the official library to access [ScrapingAnt API](https://docs.scrapingant.com) from your
JavaScript applications. It runs both in Node.js and browser and provides useful features like
automatic retries and parameters encoding to improve the ScrapingAnt usage experience.

<!-- toc -->

- [Quick Start](#quick-start)
- [API key](#api-key)
- [Retries with exponential backoff](#retries-with-exponential-backoff)
- [API Reference](#api-reference)
- [Examples](#examples)

<!-- tocstop -->

## Quick Start
```js
const ScrapingAntClient = require('@scrapingant/scrapingant-client');

const client = new ScrapingAntClient({ apiKey: '<YOUR-SCRAPINGANT-API-KEY>' });

// Scrape the example.com site.
client.scrape('https://example.com')
    .then(res => console.log(res))
    .catch(err => console.error(err.message));
```

## API key
In order to get API key you'll need to register at [ScrapingAnt Service](https://app.scrapingant.com)

## Retries with exponential backoff
Network communication sometimes fails, that's a given. The client will automatically retry requests that
failed due to a network error, an internal error of the ScrapingAnt API (HTTP 500+).
By default, it will retry up to 8 times. First retry will be attempted after ~500ms, second after ~1000ms
and so on. You can configure those parameters using the `maxRetries` and `minDelayBetweenRetriesMillis`
options of the `ScrapingAntClient` constructor.

## API Reference
All public classes, methods and their parameters can be inspected in this API reference.

<a name="ScrapingAntClient"></a>

### [](#ScrapingAntClient) ScrapingAntClient

ScrapingAntClient is the official library to access [ScrapingAnt API](https://docs.scrapingant.com) from your
JavaScript applications. It runs both in Node.js and browser.

* [ScrapingAntClient](#ScrapingAntClient)
    * [`new ScrapingAntClient(options)`](#new_ScrapingAntClient_new)
    * [`.scrape(url, [params])`](#ScrapingAntClient+scrape) ⇒ [<code>ScrapingAnt API response</code>](https://docs.scrapingant.com/request-response-format#response-structure)


* * *

<a name="new_ScrapingAntClient_new"></a>

#### [](#ScrapingAntClient) `new ScrapingAntClient(options)`


| Param                                  | Type                | Default          |
|----------------------------------------|---------------------|------------------|
| [options]                              | <code>object</code> |                  |
| [options.maxRetries]                   | <code>number</code> | <code>8</code>   |
| [options.minDelayBetweenRetriesMillis] | <code>number</code> | <code>500</code> |
| [options.timeoutSecs]                  | <code>number</code> | <code>60</code>  |
| [options.apiKey]                       | <code>string</code> |                  |


* * *

<a name="ScrapingAntClient+scrape"></a>

#### [](#ScrapingAntClient+scrape) `scrapingAntClient.scrape(url, [parameters])` ⇒ [<code>ScrapingAnt API response</code>](https://docs.scrapingant.com/request-response-format#response-structure)

https://docs.scrapingant.com/request-response-format#available-parameters

| Param                          | Type                 |
|--------------------------------|----------------------|
| url                            | <code>string</code>  |
| [parameters]                   | <code>object</code>  |
| [parameters.browser]           | <code>boolean</code> |
| [parameters.cookies]           | <code>string</code>  |
| [parameters.headers]           | <code>object</code>  |
| [parameters.js_snippet]        | <code>string</code>  |
| [parameters.proxy_type]        | <code>string</code>  |
| [parameters.proxy_country]     | <code>string</code>  |
| [parameters.wait_for_selector] | <code>string</code>  |
| [parameters.return_text]       | <code>boolean</code> |

**IMPORTANT NOTE:** <code>parameters.js_snippet</code> will be encoded to Base64 automatically by the ScrapingAnt JS client library.

* * *

<a name="ScrapingAntApiError"></a>

### [](#ScrapingAntApiError) ScrapingAntApiError

An `ScrapingAntApiError` is thrown for successful HTTP requests that reach the API,
but the API responds with an error response. Typically, those are internal errors,
which are automatically retried, or validation errors, which are thrown immediately,
because a correction by the user is needed.

**Properties**

| Name       | Type                | Description                        |
|------------|---------------------|------------------------------------|
| message    | <code>string</code> | Error message returned by the API. |
| statusCode | <code>number</code> | HTTP status code of the error.     |
| httpMethod | <code>string</code> | HTTP method of the API call.       |


* * *

## Examples

### Using residential proxy

```js
const ScrapingAntClient = require('@scrapingant/scrapingant-client');

const client = new ScrapingAntClient({ apiKey: '<YOUR-SCRAPINGANT-API-KEY>' });

// Get the residential IP info using httpbin.org
client.scrape('https://httpbin.org/ip', { proxy_type: 'residential' })
    .then(res => console.log(res))
    .catch(err => console.error(err.message));
```

### Sending custom cookies

```js
const ScrapingAntClient = require('@scrapingant/scrapingant-client');

const client = new ScrapingAntClient({ apiKey: '<YOUR-SCRAPINGANT-API-KEY>' });

// Scrape the httpbin.org site and get all the cookies sent before
client.scrape('https://httpbin.org/cookies', { cookies: 'cookieName1=cookieVal1;cookieName2=cookieVal2' })
    .then(res => console.log(res))
    .catch(err => console.error(err.message));
```

### Adding custom headers

```js
const ScrapingAntClient = require('@scrapingant/scrapingant-client');

const client = new ScrapingAntClient({ apiKey: '<YOUR-SCRAPINGANT-API-KEY>' });

// Scrape the httpbin.org site and get all the headers that would be sent before
client.scrape('https://httpbin.org/headers', { headers: { scraping: "is cool!" } })
    .then(res => console.log(res))
    .catch(err => console.error(err.message));
```


### Executing custom JS snippet

```js
const ScrapingAntClient = require('@scrapingant/scrapingant-client');

const client = new ScrapingAntClient({ apiKey: '<YOUR-SCRAPINGANT-API-KEY>' });

// Scrape the httpbin.org site and replace all the content with "Hello, world"
const customJsSnippet = "var str = 'Hello, world!';\n" +
    "var htmlElement = document.getElementsByTagName('html')[0];\n" +
    "htmlElement.innerHTML = str;"
client.scrape('https://httpbin.org/cookies', { js_snippet: customJsSnippet })
    .then(res => console.log(res))
    .catch(err => console.error(err.message));
```

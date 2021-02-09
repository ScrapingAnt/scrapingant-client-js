const { btoa } = require('abab');

/**
 * Encodes string to base64
 * @return {string}
 */
function base64encode(input) {
    return btoa(unescape(encodeURIComponent(input)));
}

/**
 * @return {boolean}
 */
function isNode() {
    return !!(typeof process !== 'undefined' && process.versions && process.versions.node);
}

module.exports = {
    base64encode,
    isNode,
};

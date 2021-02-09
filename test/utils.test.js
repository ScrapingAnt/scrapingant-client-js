const utils = require('../src/utils');

describe('utils.base64encode()', () => {
    test('works', () => {
        expect(utils.base64encode('btoa')).toEqual('YnRvYQ==');
        expect(utils.base64encode('бтоа')).toEqual('0LHRgtC+0LA=');
    });
});

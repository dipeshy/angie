const ast = require('../ast');

describe('Ast: Parse Expression statement', () => {
    it('should parse expression statement', () => {
        const text = 'Hello <b>{{friend.firstname}}</b> from {{friend.address.street}}!';
        const expected = {
            type: 'Program',
            start: 0, end: 65,
            body: [
                {
                    type: 'ExpressionStatement',
                    start: 0, end: 65,
                    expression: 'Hello <b>{{friend.firstname}}</b> from {{friend.address.street}}!'
                }
            ]
        };
        var result = ast(text);
        expect(result).toEqual(expected);
    });
});

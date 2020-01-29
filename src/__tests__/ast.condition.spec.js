const ast = require('../ast');

describe('Ast: Parse If statement', () => {
    it('should parse basic if statement', () => {
        const text = '{{#if foo}}trueblock{{/if}}';
        const expected = {
            type: 'Program',
            start: 0, end: 27,
            body: [
                {
                    type: 'IfStatement',
                    start: 0, end: 27,
                    test: 'foo',
                    consequent: {
                        type: 'BlockStatement',
                        start: 11, end: 20,
                        body: [
                            {
                                type: 'ExpressionStatement',
                                start: 11, end: 20,
                                expression: 'trueblock'
                            }
                        ],
                    },
                }
            ]
        };
        var result = ast(text);
        expect(result).toEqual(expected);
    });

    it('should parse nested if statement', () => {
        const text = '{{#if foo}}{{#if bar}}trueblock{{/if}}{{/if}}';
        const expected = {
            type: 'Program',
            start: 0, end: 45,
            body: [
                {
                    type: 'IfStatement',
                    start: 0, end: 45,
                    test: 'foo',
                    consequent: {
                        type: 'BlockStatement',
                        start: 11, end: 38,
                        body: [
                            {
                                type: 'IfStatement',
                                start: 11, end: 38,
                                test: 'bar',
                                consequent: {
                                    type: 'BlockStatement',
                                    start: 22, end: 31,
                                    body: [
                                        {
                                            type: 'ExpressionStatement',
                                            start: 22, end: 31,
                                            expression: 'trueblock'
                                        }
                                    ],
                                }
                            }
                        ],
                    },
                }
            ]
        };
        var result = ast(text);
        expect(result).toEqual(expected);
    });

    it('should parse if statement with else alternate', () => {
        const text = '{{#if bar}}trueblock{{#else}}alternate{{/if}}';
        const expected = {
            type: 'Program',
            start: 0, end: 45,
            body: [
                {
                    type: 'IfStatement',
                    start: 0, end: 45,
                    test: 'bar',
                    consequent: {
                        type: 'BlockStatement',
                        start: 11, end: 20,
                        body: [
                            {
                                type: 'ExpressionStatement',
                                start: 11, end: 20,
                                expression: 'trueblock'
                            }
                        ],
                    },
                    alternate: {
                        type: 'BlockStatement',
                        start: 29, end: 38,
                        body: [
                            {
                                type: 'ExpressionStatement',
                                start: 29, end: 38,
                                expression: 'alternate'
                            }
                        ],
                    },
                }
            ]
        };
        var result = ast(text);
        expect(result).toEqual(expected);
    });

    it('should parse with outer espressions', () => {
        const text = '<span><b>{{firstname}}</b>{{#if foo}}<i>{{foo}}</i>{{#else}}alt{{/if}}</span>';
        var expected = {
            type: 'Program',
            start: 0,
            end: 77,
            body: [
                {
                    type: 'ExpressionStatement',
                    start: 0, end: 26,
                    expression: '<span><b>{{firstname}}</b>'
                },
                {
                    type: 'IfStatement',
                    start: 26, end: 70,
                    test: 'foo',
                    consequent: {
                        type: 'BlockStatement',
                        start: 37, end: 51,
                        body: [
                            {
                                type: 'ExpressionStatement',
                                start: 37, end: 51,
                                expression: '<i>{{foo}}</i>'
                            }
                        ],
                    },
                    alternate: {
                        type: 'BlockStatement',
                        start: 60, end: 63,
                        body: [
                            {
                                type: 'ExpressionStatement',
                                start: 60, end: 63,
                                expression: 'alt'
                            }
                        ]
                    }
                },
                {
                    type: 'ExpressionStatement',
                    start: 70, end: 77,
                    expression: '</span>'
                }
            ]
        };
        var result = ast(text);
        expect(result).toEqual(expected);
    });
});

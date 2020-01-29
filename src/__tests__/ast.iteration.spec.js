const ast = require('../ast');

describe('Ast: Parse Iteration statement', () => {
    it('should parse basic each iteration', () => {
        const text = '{{#each fruits}}<li>{{this.name}}</li>{{/each}}';
        const expected = {
            type: 'Program',
            start: 0, end: 47,
            body: [
                {
                    type: 'EachStatement',
                    start: 0, end: 47,
                    left: 'this',
                    right: 'fruits',
                    body: [
                        {
                            type: 'ExpressionStatement',
                            start: 16, end: 38,
                            expression: '<li>{{this.name}}</li>'
                        }
                    ],
                }
            ]
        };
        var result = ast(text);
        expect(result).toEqual(expected);
    });

    it('should parse basic iteration with outer expressions', () => {
        const text = '<span>{{#each fruits}}<li>{{this.name}}</li>{{/each}}</span>';
        const expected = {
            type: 'Program',
            start: 0, end: 60,
            body: [
                {
                    type: 'ExpressionStatement',
                    start: 0, end: 6,
                    expression: '<span>'
                },
                {
                    type: 'EachStatement',
                    start: 6, end: 53,
                    left: 'this',
                    right: 'fruits',
                    body: [
                        {
                            type: 'ExpressionStatement',
                            start: 22, end: 44,
                            expression: '<li>{{this.name}}</li>'
                        }
                    ],
                },
                {
                    type: 'ExpressionStatement',
                    start: 53, end: 60,
                    expression: '</span>'
                },
            ]
        };
        var result = ast(text);
        expect(result).toEqual(expected);
    });
    
    it('should parse iteration with in expression', () => {
        const text = '{{#each fruit in fruits}}<li>{{fruit.name}}</li>{{/each}}';
        const expected = {
            type: 'Program',
            start: 0, end: 57,
            body: [
                {
                    type: 'EachStatement',
                    start: 0, end: 57,
                    left: 'fruit',
                    right: 'fruits',
                    body: [
                        {
                            type: 'ExpressionStatement',
                            start: 25, end: 48,
                            expression: '<li>{{fruit.name}}</li>'
                        }
                    ],
                }
            ]
        };
        var result = ast(text);
        expect(result).toEqual(expected);
    });

    it('should parse nested iteration', () => {
        const text = '{{#each items in collection}}<ul>{{#each item in items}}<b>{{item}}</b>{{/each}}</ul>{{/each}}';
        const expected = {
            type: 'Program',
            start: 0, end: 94,
            body: [
                {
                    type: 'EachStatement',
                    start: 0, end: 94,
                    left: 'items',
                    right: 'collection',
                    body: [
                        {
                            type: 'ExpressionStatement',
                            start: 29, end: 33,
                            expression: '<ul>'
                        },
                        {
                            type: 'EachStatement',
                            start: 33, end: 80,
                            left: 'item',
                            right: 'items',
                            body: [
                                {
                                    type: 'ExpressionStatement',
                                    start: 56, end: 71,
                                    expression: '<b>{{item}}</b>'
                                }
                            ],
                        },
                        {
                            type: 'ExpressionStatement',
                            start: 80, end: 85,
                            expression: '</ul>'
                        }
                    ],
                }
            ]
        };
        var result = ast(text);
        expect(result).toEqual(expected);
    });
});

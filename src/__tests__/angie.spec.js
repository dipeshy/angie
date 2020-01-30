
var angie = require('../angie');

describe('Interpolation', () => {
    it('should return string from simple variables', () => {
        const render = angie('Hello <b>{{firstname}}</b> {{lastname}}!');
        const result = render({
            firstname: 'Angie',
            lastname: 'Sunites'
        });
        expect(result).toBe('Hello <b>Angie</b> Sunites!');
    });

    it('should return string from nested objects', () => {
        const render = angie('Hello <b>{{friend.firstname}}</b> from {{friend.address.street}}!');
        const result = render({
            friend: {
                firstname: 'Angie',
                address: {
                    street: 'Doggyland'
                }
            }
        });
        expect(result).toBe('Hello <b>Angie</b> from Doggyland!');
    })
});

describe('iteration', () => {
    it.only('should return string by iterating array', () => {
        var data = {
            className: 'my-fruits',
            fruits: [
                { name: 'apple' },
                { name: 'banana' }
            ]
        };
        var template = `
            <ul class='{{className}}' >
                {{#each fruits}}
                <li id='{{index}}'>{{this.name}}</li>
                {{/each}}
            </ul>
        `;

        var expected = `
            <ul class='my-fruits' >
                <li id='0'>apple</li>
                <li id='1'>banana</li>
            </ul>
        `;
        var result = angie(template)(data);
        expect(singleLine(result)).toBe(singleLine(expected));
    });
});

describe('condition', () => {
    it('should evaluate template with condition', () => {
        var data = {
            firstname: 'Angie',
            lastname: 'Sunites'
        };
        var template = `
            <span>
                <b>{{firstname}}</b>
                {{#if middlename}}
                <i>{{middlename}}</i>
                {{/if}}
                {{#if lastname}}
                <b>{{lastname}}</b>
                {{/if}}
            </span>
        `;
        var result = `
            <span>
                <b>Angie</b>
                <b>Sunites</b>
            </span>
        `;
        expect(
            singleLine(angie(template)(data))
        ).toBe(singleLine(result));
    });

    it('should evaluate template with nested condition', () => {
        var data = {
            firstname: 'Humpty',
            lastname: 'Dumpty'
        };
        var template = `
            <span>
                <b>{{firstname}}</b>
                {{#if lastname}}
                    {{#if middlename}}
                    <b>{{middlename}}</b>
                    {{#else}}
                    <b>-</b>
                    {{/if}}
                <b>{{lastname}}</b>
                {{/if}}
            </span>
        `;
        var expected = `
            <span>
                <b>Humpty</b>
                <b>-</b>
                <b>Dumpty</b>
            </span>
        `;

        var result = angie(template)(data);
        expect(
            singleLine(result)
        ).toBe(singleLine(expected));
    });
});

function singleLine(input) {
    return input.replace(/[\s\n]+/g, ' ');
}

var angie = require('./angie');

var template = `
    <section>
        <h1>{{title}}</h1>
        <ul>
        {{#each item in orders}}
            <li>
                <b>{{item.name}}</b>
                <p>
                {{#if item.description}}
                {{item.description}}
                {{#else}}
                -
                {{/if}}
                <p>
                {{#if item.prices}}
                <ol>
                {{#each price in item.prices}}
                    <li>{{price}}</li>
                {{/each}}
                </ol>
                {{/if}}
            </li>
        {{/each}}
        </ul>
    </section>
`;

var data = {
    title: 'Hello',
    orders: [
        {name: 'apple', prices: [10, 20], description: 'Green apple'},
        {name: 'banana', prices: [20]},
        {name: 'cabbage'}
    ]
};

var render = angie(template);
console.log(render(data));


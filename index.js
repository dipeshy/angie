var angie = require('./lib/angie');

var template = `
    <div>
        <h1>List of {{titleFruits}}</h1>
        <ul>
            {{#each fruits}}
                <li data-idx="{{index}}">{{.name}}
                    <ul>
                        {{#each .prices}}
                        <li data-idx="{{index}}">{{.}}</li>
                        {{/each}}
                    </ul>
                </li>
            {{/each}}
        </ul>
        <h1>List of {{titleVegetables}}</h1>
        <ul>
        {{#each vegetables}}
            <li>{{.}}</li>
        {{/each}}
        </ul>
    </div>
`;

var input = {
    titleFruits: 'Fruits',
    fruits: [{name: 'apple', prices: ["10", "20"]}, {name: 'banana', prices: ["30"]}],
    titleVegetables: 'Vegetables',
    vegetables: ['cabbage', 'pumpkins']
};

console.log(angie(template)(input));
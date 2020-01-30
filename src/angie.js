
var utils = require('./utils');
var ast = require('./ast');
var nodeTypes = require('./nodes').nodeTypes;

var expressions = {
    interpolation: /\{\{([^\}]+)\}\}/g,
};

function normalizePath(pathStr) {
    return pathStr.replace(/^\.(.*)$/, function (_, rest) {
        var result = ['this'];
        if (rest) {
            result.push(rest);
        }
        return result.join('.');
    });
}

function interpolate(template, context) {
    var expr = expressions.interpolation;

    if (!expr.test(template)) {
        return template;
    }
    return template.replace(expr, function (match, tag) {
        var value = utils.resolveObjectPath(context, normalizePath(tag));
        if (value === undefined) {
            return '';
        }

        if (typeof value === 'function') {
            return value(context);
        }
        return value;
    });
}

function create(template, _initialData) {
    var initialData = _initialData || {};
    var tree = ast(template);
    return function evaluate(data) {
        var context = utils.extend(initialData, data);
        return evaluateNode('', tree, context);
    }
}

function evaluateNode (pretext, node, context) {
    var result = '';
    switch (node.type) {
        case nodeTypes.Program:
        case nodeTypes.BlockStatement:
            return evaluateMulti(pretext, node.body || [], context);
        case nodeTypes.Expression:
            return pretext + interpolate(node.expression, context);
        case nodeTypes.EachStatement:
            var iterableValue = utils.resolveObjectPath(context, normalizePath(node.right));
            result = pretext + iterableValue.map(function (value, idx) {
                var eachContext = utils.extend(context, { [node.left]: value, 'index': idx });
                return evaluateMulti('', node.body || [], eachContext);
            }).join('');
            return result;
        case nodeTypes.IfStatement:
            var value = utils.resolveObjectPath(context, normalizePath(node.test));
            if (!utils.isNil(value)) {
                result = evaluateNode(pretext, node.consequent, context);
            } else if (node.alternate) {
                result = evaluateNode(pretext, node.alternate, context);
            } else {
                result = pretext;
            }
            return result;
        default:
            throw new Error('Invalid node:' + node.type);
    }
}

function evaluateMulti(pretext, nodes, context) {
    var result = nodes.reduce(function(acc, childNode) {
        return evaluateNode(acc, childNode, context);
    }, pretext);
    return result;
}

module.exports = create;


var nodes = require('./nodes');
var nodeTypes = nodes.nodeTypes;

function ast(text) {
    var tokensExpr = /\{\{([#\/])([\w]+)(\s([\w\W]+?))?\}\}/;
    var stack = [];
    var matches = _matchAll(tokensExpr, text, []);
    var pointer = 0;
    var current = nodes.createProgramNode(pointer);

    matches.forEach(function (match) {
        var matchText = match[0];
        var isStartToken = match[1] === '#' ? true : false;
        var type = nodes.parseType(match[2]);
        var parent;

        var expressionText, expressionNode;
        expressionText = text.substring(pointer, match.index);
        if (expressionText) {
            expressionNode = nodes.createExpressionNode(pointer, expressionText);
            current = nodes.pushNode(current, expressionNode);
            pointer = pointer + expressionText.length;
        }

        if (isStartToken) {
            switch (type) {
                case nodeTypes.IfStatement:
                    stack.push(current);
                    // Start IfStatement block
                    current = nodes.createIfNode(pointer, match[4]);
                    pointer = pointer + matchText.length;
                    current.consequent = nodes.createBlockNode(pointer);
                    break;
                case nodeTypes.ElseStatement:
                    current.consequent.end = pointer;
                    // Start IfStatement's alternate block
                    pointer = pointer + matchText.length;
                    current.alternate = nodes.createBlockNode(pointer);
                    break;
                case nodeTypes.EachStatement:
                    var eachExpression = match[4]
                    var expressionParts = eachExpression.match(/^(([\w]+)\sin\s)?([\w]+)$/);
                    if (!expressionParts) {
                        throw new Error('Invalid expression for each statement at index: ' + match.index);
                    }
                    stack.push(current);
                    current = nodes.createEachNode(pointer, expressionParts[2] || 'this', expressionParts[3]);
                    pointer = pointer + matchText.length;
                    break;
            }
        } else {
            pointer = pointer + matchText.length;
            current.end = pointer;
            parent = stack.pop();
            current = nodes.pushNode(parent, current);
        }
    });

    var end = text.length;
    var remainingText = text.substr(pointer, end);
    if (remainingText) {
        expressionNode = nodes.createExpressionNode(pointer, remainingText);
        current = nodes.pushNode(current, expressionNode);
    }
    current.end = end;
    return current;
}

function _matchAll (expression, text) {
    function accumulate (_text, _result, indexOffset) {
        var matchResult = _text.match(expression);
        if (!matchResult) {
            return _result;
        }
        var remainingText = _text.substr(matchResult.index + matchResult[0].length);
        matchResult.index = matchResult.index + indexOffset;
        _result.push(matchResult);
        return accumulate(remainingText, _result, matchResult.index + matchResult[0].length);
    }
    return accumulate(text, [], 0);
}

module.exports = ast;

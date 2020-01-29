
var nodeTypes = {
    Program: 'Program',
    IfStatement: 'IfStatement',
    ElseStatement: 'ElseStatement',
    BlockStatement: 'BlockStatement',
    EachStatement: 'EachStatement',
    Expression: 'ExpressionStatement',
};

function parseType(input) {
    switch (input) {
        case 'if':
            return nodeTypes.IfStatement;
        case 'else':
            return nodeTypes.ElseStatement;
        case 'each':
            return nodeTypes.EachStatement;
    }
}

function createNode(nodeType, start, end) {
    return {
        type: nodeType,
        start: start,
        end: (end === undefined)? start: end,
    };
}

function pushNode (targetNode, node) {
    switch (targetNode.type) {
        case nodeTypes.EachStatement:
        case nodeTypes.Program:
            targetNode.body = _listPush(targetNode.body, node);
            targetNode.end = node.end;
            break;
        case nodeTypes.IfStatement:
            if (targetNode.alternate) {
                targetNode.alternate.body = _listPush(targetNode.alternate.body, node);
                targetNode.alternate.end = node.end; 
            } else {
                targetNode.consequent.body = _listPush(targetNode.consequent.body, node);
                targetNode.consequent.end = node.end;
            }
            break;
        default:
            throw new Error('Not allowed to push node to type: ' + targetNode.type);
    }

    return targetNode;
}

function _listPush (_list, item) {
    var list = _list || [];
    list.push(item);
    return list;
}

function createProgramNode(start, end) {
    var node = createNode(nodeTypes.Program, start, end);
    node.body = [];
    return node;
}

function createExpressionNode(start, text) {
    var node = createNode(nodeTypes.Expression, start, start + text.length);
    node.expression = text.replace(/(^\n|\n$)/g, '');
    return node;
}

function createIfNode(start, test) {
    var node = createNode(nodeTypes.IfStatement, start);
    node.test = test;
    return node;
}

function createBlockNode(start) {
    var node = createNode(nodeTypes.BlockStatement, start);
    node.body = [];
    return node;
}

function createEachNode(start, left, right) {
    var node = createNode(nodeTypes.EachStatement, start);
    node.left = left;
    node.right = right;
    return node;
}

module.exports = {
    nodeTypes: nodeTypes,
    parseType: parseType,
    createNode: createNode,
    pushNode: pushNode,
    createProgramNode: createProgramNode,
    createExpressionNode: createExpressionNode,
    createIfNode: createIfNode,
    createBlockNode: createBlockNode,
    createEachNode: createEachNode,
};

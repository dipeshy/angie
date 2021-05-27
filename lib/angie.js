var utils = require('./utils');

function replaceTag(template, context) {
    return template.replace(/\{\{([^\}]+)\}\}/g, function (match, tag) {
        var value = utils.resolvePath(context, utils.normalizePath(tag));
        return value === undefined? '': value;
    });
}
function replaceForEach(template, context) {
    // Replace Iterator context
    var expr = /\{\{#each\s([\.\w]+)\}\}([\w\W]*?)\{\{\/each\}\}(?![^\{]*?\{\{\/each\}\})/g;
    // var expr1 = /\{\{#each\s(\w+)\}\}([\w\W]*?)\{\{\/each\}\}/g;

    if (!expr.test(template)) {
        return template;
    }

    return template.replace(expr, function (_, key, eachTemplate) {
        var iterable = utils.resolvePath(context, utils.normalizePath(key));
        return iterable.map(function (value, idx) {
            var localContext = {'this': value, 'index': idx};
            return replaceTag(replaceForEach(eachTemplate, localContext), localContext);
        }).join(' ');
    });
}

function render(template) {
    return function (data) {
        var result;
        result = replaceForEach(template, data);
        return replaceTag(result, data);   
    }
}

module.exports = render;

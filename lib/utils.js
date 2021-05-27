function resolvePath(data, _paths) {
    var paths = (typeof _paths === 'string')? _paths.split('.'): _paths;

    if (typeof data !== 'object') {
        return data;
    }

    if (paths.length < 1) {
        return data;
    }

    return resolvePath(data[paths[0]], paths.slice(1));
}

function normalizePath(pathStr) {
    return pathStr.replace(/^\.(.*)$/, function (_, rest) {
        var result = ['this'];
        if (rest) {
            result.push(rest);
        }
        return result.join('.');
    });
}

module.exports = {
    resolvePath: resolvePath,
    normalizePath: normalizePath
}
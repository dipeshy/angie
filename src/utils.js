+function () {
    /**
     * Returns new copy of object
     * @param {object} source 
     */
    function clone(source) {
        if (typeof source !== 'object') {
            return source;
        }

        // Return falsy object and function back as it is
        if (!source || typeof source === 'function' ) {
            return source;
        }

        if (Array.isArray(source)) {
            return source.map(clone);
        }

        var result = {};
        var value;
        Object.keys(source).forEach(function (key) {
            value = source[key];
            result[key] = clone(value);
        });
        return result;
    }

    /**
     * Merge object with another object
     * @param {object} source 
     * @param {object} target 
     */
    function extend(source, target) {
        var result = clone(source);

        if (!target) {
            return result;
        }

        Object.keys(target).forEach(function (key) {
            result[key] = clone(target[key]);
        });

        return result;
    }

    function groupByAttr(attr, objectList) {
        var grouped = {};

        objectList.forEach(function (item) {
            var key = item[attr];
            if (!key) {
                return;
            }
            var value = grouped[key] || [];

            value.push(item);
            grouped[key] = value;
        });
        return grouped;
    }

    function objectToArray(obj) {
        return Object.keys(obj).map(function (key) {
            return obj[key];
        });
    }

    function getObjectKeys(obj) {
        var result = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                result.push(prop);
            }
        }
        return result;
    }

    function getObjectValues(obj) {
        var values = [];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                values.push(obj[prop]);
            }
        }
        return values;
    }

    function resolveObjectPath(data, _paths) {
        var paths = (typeof _paths === 'string')? _paths.split('.'): _paths;

        if (typeof data !== 'object') {
            return data;
        }

        if (paths.length < 1) {
            return data;
        }

        return resolveObjectPath(data[paths[0]], paths.slice(1));
    }

    /**
     * return inclusive range values
     * @param {number} start 
     * @param {number} end 
     */
    function range(start, end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }

    /**
     * return numberstring with padded zero
     * @param {*} number 
     */
    function numToString(number) {
        var padding = (number < 10)? '0': '';
        return padding + number;
    }

    function arrayFilter(array, predicate) {
        return Array.prototype.filter.call(array, predicate);
    }

    function arrayRemove(array, targets) {
        return arrayFilter(array, function (value) {
            return targets.indexOf(value) < 0;
        });     
    }

    function arrayMerge(array1, array2) {
        // clone
        var start = array1.map(function (item) { 
            return item 
        });

        return array2.reduce(function (accumulator, item) {
            accumulator.push(item);
            return accumulator;
        }, start);
    }

    function isNil(value) {
        return value === undefined || value === null;
    }

    module.exports = {
        clone: clone,
        extend: extend,
        groupByAttr: groupByAttr,
        objectToArray: objectToArray,
        getObjectKeys: getObjectKeys,
        getObjectValues: getObjectValues,
        resolveObjectPath: resolveObjectPath,
        range: range,
        numToString: numToString,
        arrayFilter: arrayFilter,
        arrayRemove: arrayRemove,
        arrayMerge: arrayMerge,
        isNil: isNil,
    };
}();
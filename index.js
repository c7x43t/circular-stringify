function getCircularReplacer() {
    const seen = new Map();
    let index = 0;

    return function (key, value) {
        if (value && typeof value === 'object') {
            if (seen.has(value)) {
                return `__cdep[[${seen.get(value)}]]`;
            }
            seen.set(value, index++);
        }
        return value;
    };
}

function getCircularReviver() {
    const refs = [];

    return function (key, value) {
        if (typeof value === 'string' && value.startsWith('__cdep[[') && value.endsWith(']]')) {
            return { __isRef: true, ref: parseInt(value.slice(8, -2), 10) };
        }
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            refs.push(value);
        }
        return value;
    };
}

function restoreCircular(obj) {
    const refs = [];
    const queue = [{ parent: null, key: '', value: obj }];
    const objects = new Map();

    while (queue.length > 0) {
        const { parent, key, value } = queue.shift();

        if (value && typeof value === 'object') {
            if (value.__isRef !== undefined) {
                if (parent) {
                    parent[key] = objects.get(value.ref);
                }
            } else {
                const objRef = objects.size;
                objects.set(objRef, value);
                if (parent) {
                    parent[key] = value;
                }
                for (const [k, v] of Object.entries(value)) {
                    queue.push({ parent: value, key: k, value: v });
                }
            }
        }
    }
    return obj;
}

const Circular = {
    stringify: function stringify(circularObj, _, n) {
        return JSON.stringify(circularObj, getCircularReplacer(), n ?? 2);
    },
    parse: function parse(jsonString) {
        return JSON.parse(jsonString, getCircularReviver());
    }
};
module.export = Circular;

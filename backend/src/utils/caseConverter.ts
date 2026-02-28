/**
 * Utility to convert snake_case keys to camelCase
 */
export const toCamelCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => toCamelCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result: any, key) => ({
                ...result,
                [key.replace(/(_\w)/g, k => k[1].toUpperCase())]: toCamelCase(obj[key]),
            }),
            {},
        );
    }
    return obj;
};

/**
 * Utility to convert camelCase keys to snake_case
 */
export const toSnakeCase = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => toSnakeCase(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => ({
                ...result,
                [key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)]: toSnakeCase(obj[key]),
            }),
            {},
        );
    }
    return obj;
};

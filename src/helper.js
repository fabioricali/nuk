module.exports = {
    dashToCamelCase(str) {
        return str
            .toLowerCase()
            .replace(/^(.)/, function (g) {
                return g.toUpperCase();
            })
            .replace(/-([a-z])/g, function (g) {
                return g[1].toUpperCase();
            });
    },

    arrayUnique(arr) {
        return [...new Set(arr)];
    }
};
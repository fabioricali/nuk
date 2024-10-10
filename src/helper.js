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
    },

    splitAtLastAt(str) {
        const hasScope = str.startsWith('@');
        const lastAtIndex = str.lastIndexOf('@');

        if (lastAtIndex === -1 || (hasScope && lastAtIndex === 0)) {
            // Se non c'è "@" nella stringa, restituiamo la stringa originale.
            return [str];
        }

        const beforeAt = str.slice(0, lastAtIndex);
        const afterAt = str.slice(lastAtIndex + 1);

        return [beforeAt, afterAt];
    },

    splitStringPath(input) {
        let splitResult;

        if (input.startsWith('@')) {
            // Trova il secondo "/" dopo "@"
            let firstSlashIndex = input.indexOf('/');
            // console.log('firstSlashIndex', firstSlashIndex)
            let secondSlashIndex = input.indexOf('/', firstSlashIndex + 1);
            // console.log('secondSlashIndex', secondSlashIndex)
            if (secondSlashIndex === -1) {
                splitResult = [input]
            } else {
                // Dividi la stringa in due parti: prima del secondo "/" e il resto
                splitResult = [input.slice(0, secondSlashIndex), ...input.slice(secondSlashIndex + 1).split('/')];
            }

        } else {
            // Se non c'è "@" splitta normalmente
            splitResult = input.split('/');
        }

        return splitResult;
    }
};
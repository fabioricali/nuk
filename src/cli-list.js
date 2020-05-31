#!/usr/bin/env node

const program = require('commander');
const request = require('axios');
const {EXCLUDE_FILES, BASE_API_LIST} = require('./constants');
const chalk = require('chalk');

(async function () {
    const output = [];
    let packageName;

    function addFile(file) {
        if (!output.includes(file))
            output.push(file);
    }

    function iterateFilesList(files, path = '') {
        files.forEach(file => {
            if (file.type === 'directory') {
                iterateFilesList(file.files, path + '/' + file.name);
                if (path === '') {
                    addFile(packageName + '/' + file.name);
                }
            } else {
                if (!EXCLUDE_FILES.includes(file.name.toLowerCase()))
                    addFile(packageName + path + '/' + file.name);
            }
        })
    }

    try {
        program
            .parse(process.argv)
        ;

        packageName = program.args[0];

        let response = await request(BASE_API_LIST + packageName);
        if (response.data.tags && response.data.tags.latest) {
            response = await request(BASE_API_LIST + packageName + '@' + response.data.tags.latest);
        }

        if (response.data.default) {
            addFile(packageName + response.data.default);
        }

        iterateFilesList(response.data.files);

        console.log('Here\'s what you can include of', chalk.greenBright(packageName));

        output.sort().forEach(
            item => console.log(chalk.cyanBright('nuk install ' + item))
        )

    } catch (e) {
        console.error(e.message);
    }

})();

#!/usr/bin/env node

const program = require('commander');
const {NUK_JSON_FILENAME, VENDORS_FOLDER, TESTING} = require('./constants');
const chalk = require('chalk');
const readdirp = require('readdirp');
const concat = require('concat');
const path = require('path');
const fs = require('fs-extra');

(async function () {
    program
        .parse(process.argv)
    ;

    const isTesting = program.args.length && program.args[program.args.length - 1] === TESTING;

    if (isTesting) {
        console.log('testing mode...');
        process.chdir('test/cwd');
    }
    const CWD = process.cwd();

    let nukJSON;
    if (await fs.pathExists(NUK_JSON_FILENAME)) {
        nukJSON = await fs.readJson(NUK_JSON_FILENAME);
    } else {
        throw new Error('nuk.json is required');
    }

    try {

        let files;
        let filesJS = [];
        let filesCSS = [];

        if (nukJSON.bundleFiles) {
            files = nukJSON.bundleFiles;
            console.log(chalk.cyanBright('bundleFiles from nuk.json'));
            console.log(chalk.greenBright(files.join('\n')));
        } else {
            files = await readdirp.promise(CWD + '/' + VENDORS_FOLDER);
            files = files.map(file => file.path);
            files.filter(file => {
                    let re = /.*\.min\.(js|css)/.test(file);
                    if (re) {
                        console.log(chalk.greenBright(file, 'included'));
                    } else {
                        console.log(chalk.redBright(file, 'not included'));
                    }

                    return re;
                })
            ;
        }

        for (let i = 0; i < files.length; i++) {
            if (path.extname(files[i]) === '.css') {
                filesCSS.push(path.normalize(CWD + '/' + VENDORS_FOLDER + '/' + files[i]));
            } else if (path.extname(files[i]) === '.js') {
                filesJS.push(path.normalize(CWD + '/' + VENDORS_FOLDER + '/' + files[i]));
            }
        }

        await concat(filesJS, CWD + '/' + VENDORS_FOLDER + '/' + 'bundle.js');
        let contentFileJS = await fs.readFile(CWD + '/' + VENDORS_FOLDER + '/' + 'bundle.js');
        contentFileJS = contentFileJS.toString().replace(/\/\/# sourceMappingURL/g, '//# sourceMappingURL_DISABLED_');
        await fs.writeFile(CWD + '/' + VENDORS_FOLDER + '/' + 'bundle.js', contentFileJS);

        await concat(filesCSS, CWD + '/' + VENDORS_FOLDER + '/' + 'bundle.css');

    } catch (e) {
        console.error(e.message);
    }

})();

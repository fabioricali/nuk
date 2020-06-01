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
    //let bundleName = 'bundle';

    if (await fs.pathExists(NUK_JSON_FILENAME)) {
        nukJSON = await fs.readJson(NUK_JSON_FILENAME);
    } else {
        throw new Error('nuk.json is required');
    }

    try {

        let files;
        //let filesJS = [];
        //let filesCSS = [];
        let bundleOperation = {
            bundle: []
        };
        let bundleOperationMap = {};

        if (Array.isArray(nukJSON.bundleFiles)) {
            files = nukJSON.bundleFiles;
            console.log(chalk.cyanBright('bundleFiles from nuk.json'));
            console.log(chalk.greenBright(files.join('\n')));

            bundleOperation.bundle = files;
        } else if (nukJSON.bundleFiles && typeof nukJSON.bundleFiles === 'object'){
            bundleOperation = nukJSON.bundleFiles;
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
            });

            bundleOperation.bundle = files;
        }

        let bundleNames = Object.keys(bundleOperation);

        for (let y = 0; y < bundleNames.length; y++) {
            let bundleName = bundleNames[y];

            for (let i = 0; i < bundleOperation[bundleName].length; i++) {
                if (!bundleOperationMap[bundleName]) {
                    bundleOperationMap[bundleName] = {
                        filesJS: [],
                        filesCSS: []
                    }
                }
                if (path.extname(bundleOperation[bundleName][i]) === '.css') {
                    bundleOperationMap[bundleName].filesCSS.push(path.normalize(CWD + '/' + VENDORS_FOLDER + '/' + bundleOperation[bundleName][i]));
                } else if (path.extname(bundleOperation[bundleName][i]) === '.js') {
                    bundleOperationMap[bundleName].filesJS.push(path.normalize(CWD + '/' + VENDORS_FOLDER + '/' + bundleOperation[bundleName][i]));
                }
            }
        }
        let bundleNamesMap = Object.keys(bundleOperationMap);

        for (let y = 0; y < bundleNamesMap.length; y++) {
            let bundleName = bundleNamesMap[y];
            if (bundleOperationMap[bundleName].filesJS.length) {
                await concat(bundleOperationMap[bundleName].filesJS, CWD + '/' + VENDORS_FOLDER + '/' + bundleName + '.js');
                let contentFileJS = await fs.readFile(CWD + '/' + VENDORS_FOLDER + '/' + bundleName + '.js');
                contentFileJS = contentFileJS.toString().replace(/\/\/# sourceMappingURL/g, '//# sourceMappingURL_DISABLED_');
                await fs.writeFile(CWD + '/' + VENDORS_FOLDER + '/' + bundleName + '.js', contentFileJS);
            }

            if (bundleOperationMap[bundleName].filesCSS.length)
                await concat(bundleOperationMap[bundleName].filesCSS, CWD + '/' + VENDORS_FOLDER + '/' + bundleName + '.css');
        }

    } catch (e) {
        console.error(e.message);
    }

})();

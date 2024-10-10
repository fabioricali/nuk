#!/usr/bin/env node

const program = require('commander');
const util = require('util');
const fs = require('fs-extra');
const {NUK_JSON_LOCK_FILENAME, TESTING} = require('./constants');
const chalk = require('chalk');
const {splitAtLastAt, splitStringPath} = require("./helper");
const exec = util.promisify(require('child_process').exec);

(async function () {
    try {
        program
            .parse(process.argv)
        ;

        const isTesting = program.args.length && program.args[program.args.length - 1] === TESTING;
        let packageName = program.args[0];
        // packageName = packageName.split('@')[0];
        packageName = splitAtLastAt(packageName)[0];
        let nukJSONLock = {}

        if (isTesting) {
            console.log('testing mode...');
            process.chdir('test/cwd');
        }

        if (await fs.pathExists(NUK_JSON_LOCK_FILENAME)) {
            nukJSONLock = Object.assign({}, nukJSONLock, await fs.readJson(NUK_JSON_LOCK_FILENAME));
        } else {
            return console.error('nuk-lock.json is required');
        }

        let allVersions = (await exec(`npm view ${packageName} versions -json`)).stdout;
        allVersions = JSON.parse(allVersions);
        let latestVersion = allVersions[allVersions.length - 1];

        let packagesKeys = Object.keys(nukJSONLock.packages);
        let expressions = [];

        for (let y = 0; y < packagesKeys.length; y++) {
            // let packageWithoutVersion = packagesKeys[y].split('@')[0];
            let packageWithoutVersion = splitAtLastAt(packagesKeys[y])[0];
            if (packageWithoutVersion === packageName) {
                expressions = nukJSONLock.packages[packagesKeys[y]].expressions.map(item => {
                    // let itemParts = item.split('/');
                    let itemParts = splitStringPath(item);
                    itemParts.shift();
                    if(itemParts.length)
                        return `${packageName}@${latestVersion}/${itemParts.join('/')}`;
                    else
                        return `${packageName}@${latestVersion}`;
                });
                break;
            }
        }
        console.log('new expressions: ', expressions);
        console.log(`uninstall ${packageName}`);
        await exec(`nuk uninstall ${packageName}`);
        console.log(`install latest version of ${packageName}: ${latestVersion}`);
        await exec(`nuk install ${expressions.join(' ')}`);

        console.log(chalk.greenBright('complete!'));
    } catch (e) {
        console.error(e.message);
    }

})();

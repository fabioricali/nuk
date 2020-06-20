#!/usr/bin/env node

const program = require('commander');
const {NUK_JSON_FILENAME, NUK_JSON_LOCK_FILENAME, VENDORS_FOLDER, TESTING} = require('./constants');
const chalk = require('chalk');
const fs = require('fs-extra');

async function removePackage(packageToUninstall, CWD, _VENDORS_FOLDER, nukJSON, nukJSONLock) {
    // Remove package
    //await fs.remove(`${CWD}/${_VENDORS_FOLDER}/${nukJSONLock.packages[packageToUninstall].folder}`);
    await fs.remove(`${CWD}/${_VENDORS_FOLDER}/${packageToUninstall}`);

    // Remove expression from expressions
    nukJSON.expressions = nukJSON.expressions.filter(expression =>
        !nukJSONLock.packages[packageToUninstall].expressions.includes(expression)
    )
    // Remove form packages of nuk.json
    delete nukJSONLock.packages[packageToUninstall];
}

(async function () {

    try {
        program
            .parse(process.argv)
        ;

        const isTesting = program.args.length && program.args[program.args.length - 1] === TESTING;
        let _VENDORS_FOLDER = VENDORS_FOLDER;

        if (isTesting) {
            console.log('testing mode...');
            process.chdir('test/cwd');
        }

        let nukJSON = {
            expressions: []
        }

        let nukJSONLock = {
            packages: {}
        }

        if (await fs.pathExists(NUK_JSON_FILENAME)) {
            nukJSON = Object.assign({}, nukJSON, await fs.readJson(NUK_JSON_FILENAME));
        }

        if (await fs.pathExists(NUK_JSON_LOCK_FILENAME)) {
            nukJSONLock = Object.assign({}, nukJSONLock, await fs.readJson(NUK_JSON_LOCK_FILENAME));
        } else {
            return console.error('nuk-lock.json is required');
        }

        _VENDORS_FOLDER = nukJSON.folderName || _VENDORS_FOLDER;
        
        let distPackages = program.args[0] + ''.trim();
        const CWD = process.cwd();

        distPackages = distPackages.split(' ');

        let totalOperation = 0;

        let packagesKeys = Object.keys(nukJSONLock.packages);

        try {
            for (let i = 0; i < distPackages.length; i++) {

                let packageToUninstall = distPackages[i];

                console.log(`remove: ${packageToUninstall}...`);
                if (!packageToUninstall
                ) continue;

                // if uninstall a specific version
                if (packageToUninstall.includes('@')) {
                    if (nukJSONLock.packages[packageToUninstall] /*&& nukJSONLock.packages[packageToUninstall].folder*/) {
                        // Remove package
                        await removePackage(packageToUninstall, CWD, _VENDORS_FOLDER, nukJSON, nukJSONLock);
                    }
                } else {
                    // if uninstall with name only
                    for (let y = 0; y < packagesKeys.length; y++) {
                        let packageWithoutVersion = packagesKeys[y].split('@')[0];
                        if (packageWithoutVersion === packageToUninstall) {
                            if (nukJSONLock.packages[packagesKeys[y]] /*&& nukJSONLock.packages[packagesKeys[y]].folder*/) {
                                // Remove package
                                await removePackage(packagesKeys[y], CWD, _VENDORS_FOLDER, nukJSON, nukJSONLock);
                            }
                        }
                    }
                }

                totalOperation++;
            }
        } catch (e) {
            console.error(e.message);
        } finally {
            // Write nuk.json
            await fs.writeJson(NUK_JSON_FILENAME, nukJSON, {
                spaces: '  '
            });
            // Write nuk-lock.json
            await fs.writeJson(NUK_JSON_LOCK_FILENAME, nukJSONLock, {
                spaces: '  '
            });

            if (totalOperation)
                console.log(chalk.greenBright('complete!'));
            else
                console.log(chalk.redBright('no packages uninstalled!'));
        }

    } catch (e) {
        console.error(e.message);
    }

})();

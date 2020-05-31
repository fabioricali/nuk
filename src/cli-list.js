#!/usr/bin/env node

const program = require('commander');
const request = require('axios');
const {NUK_JSON_FILENAME, VENDORS_FOLDER, PROCESSING_FOLDER, REGEX_GET_ARGS, TESTING} = require('./constants');
const chalk = require('chalk');
const fs = require('fs-extra');

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
            packages: {},
            expressions: []
        }

        if (await fs.pathExists(NUK_JSON_FILENAME)) {
            nukJSON = Object.assign({}, nukJSON, await fs.readJson(NUK_JSON_FILENAME));
        }

        _VENDORS_FOLDER = nukJSON.folderName || _VENDORS_FOLDER;
        
        let distPackages = program.args;//[0] + ''.trim();
        const CWD = process.cwd();

        //distPackages = distPackages.split(' ');

        let totalOperation = 0;

        try {
            for (let i = 0; i < distPackages.length; i++) {

                let packageToUninstall = distPackages[i];

                if (!packageToUninstall
                    || !nukJSON.packages
                    || !nukJSON.packages[packageToUninstall]
                    || !nukJSON.packages[packageToUninstall].folder
                ) continue;

                console.log(`remove: ${packageToUninstall}...`);

                // Remove package
                await fs.remove(`${CWD}/${_VENDORS_FOLDER}/${nukJSON.packages[packageToUninstall].folder}`);

                // Remove expression from expressions
                nukJSON.expressions = nukJSON.expressions.filter(expression =>
                    !nukJSON.packages[packageToUninstall].expressions.includes(expression)
                )
                // Remove form packages of nuk.json
                delete nukJSON.packages[packageToUninstall];

                totalOperation++;
            }
        } catch (e) {
            console.error(e.message);
        } finally {
            // Write nuk.json
            await fs.writeJson(NUK_JSON_FILENAME, nukJSON, {
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

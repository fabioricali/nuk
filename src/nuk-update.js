#!/usr/bin/env node

const program = require('commander');
const util = require('util');
const {TESTING} = require('./constants');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);

(async function () {
    try {
        program
            .parse(process.argv)
        ;

        const isTesting = program.args.length && program.args[program.args.length - 1] === TESTING;
        let packageName = program.args[0];
        packageName = packageName.split('@')[0];

        if (isTesting) {
            console.log('testing mode...');
            process.chdir('test/cwd');
        }

        let allVersions = (await exec(`npm view ${packageName} versions -json`)).stdout;
        allVersions = JSON.parse(allVersions);
        let latestVersion = allVersions[allVersions.length - 1];
        console.log(`uninstall ${packageName}`);
        await exec(`nuk uninstall ${packageName}`);
        console.log(`install latest version of ${packageName}: ${latestVersion}`);
        await exec(`nuk install ${packageName}@${latestVersion}`);

    } catch (e) {
        console.error(e.message);
    }

})();

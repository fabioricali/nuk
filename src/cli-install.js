#!/usr/bin/env node

const program = require('commander');
const util = require('util');
const downloadRepo = util.promisify(require('download-git-repo'));
const {REPO, TESTING} = require('./constants');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs-extra');

(async function () {

    try {
        program
            .parse(process.argv)
        ;

        const isTesting = program.args.length && program.args[program.args.length - 1] === TESTING;

        if (isTesting) {
            console.log('testing mode...');
            process.chdir('test/cwd');
        }

        let nukJSON = {dependencies: {}}
        if (await fs.pathExists('nuk.json')) {
            nukJSON = await fs.readJson('nuk.json');
        }

        let distPackages = program.args[0] + ''.trim();
        const cwd = process.cwd();

        /*if (!distPackages) {
            await Promise.reject(new Error('Project name is required'));
        }*/

        distPackages = distPackages.split(' ');
        let distPackageName;

        for (let i = 0; i < distPackages.length; i++) {
            distPackageName = distPackages[i];

            if (!distPackageName) continue;

            // ==== STEP 1 ====
            console.log(`Downloading ${distPackageName}...`);

            let projectPath = `${cwd}/vendors_dist/${distPackageName}`;

            if (isTesting) {
                await fs.copy('../repo/mylib', projectPath);
            } else {
                // ==== STEP 2 ====
                //await downloadRepo(REPO.APP, projectPath);

                // ==== STEP 3 ====
                // change directory to project
                //process.chdir(projectPath);

                // ==== STEP 4 ====
                // install dependencies
                //console.log(`Installing dependencies...`);
                //await exec(`npm install`);
            }

            nukJSON.dependencies[distPackageName] = '0.0.0';
        }

        // Update nuk.json
        await fs.writeJson('nuk.json', nukJSON, {
            spaces: '  '
        });
        console.log(chalk.greenBright('the packages are installed!'));
    } catch (e) {
        console.error(e.message);
    }

})();

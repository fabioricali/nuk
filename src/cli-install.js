#!/usr/bin/env node

const program = require('commander');
const util = require('util');
const downloadRepo = util.promisify(require('download-git-repo'));
const {REPO, TESTING} = require('./constants');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs-extra');

const VENDORS_FOLDER = 'vendors_dist';
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
        let distPackageExpression;

        for (let i = 0; i < distPackages.length; i++) {
            distPackageExpression = distPackages[i];

            if (!distPackageExpression) continue;

            // ==== STEP 1 ====
            console.log(`Try to install ${distPackageExpression}...`);

            let distPackageExpressionParts = distPackageExpression.split('/');
            let distPackageName = distPackageExpressionParts[0];
            // Remove first item.. package name
            distPackageExpressionParts.shift();
            let packageFilesPath = distPackageExpressionParts.join('/');

            //await fs.ensureDir(`${cwd}/${VENDORS_FOLDER}/__processing__`);

            //let projectPath = `${cwd}/${VENDORS_FOLDER}/${distPackageName}`;

            let tgzFile = (await exec(`npm pack ${distPackageName}`)).stdout.trim();
            let fileWithoutTgz = tgzFile.split('.').slice(0, -1).join('.');

            await fs.move(tgzFile, `${VENDORS_FOLDER}/__processing__/${tgzFile}/${tgzFile}`, {overwrite: true});
            await exec(`tar -xzf ${VENDORS_FOLDER}/__processing__/${tgzFile}/${tgzFile} -C ${VENDORS_FOLDER}/__processing__/${tgzFile}`);

            await fs.copy(`${VENDORS_FOLDER}/__processing__/${tgzFile}/package/${packageFilesPath}`, `${VENDORS_FOLDER}/${fileWithoutTgz}/`);

            //if (isTesting) {
                //await fs.copy('../repo/mylib', projectPath);
            //} else {
                // ==== STEP 2 ====
                //await downloadRepo(REPO.APP, projectPath);

                // ==== STEP 3 ====
                // change directory to project
                //process.chdir(projectPath);

                // ==== STEP 4 ====
                // install dependencies
                //console.log(`Installing dependencies...`);
                //await exec(`npm install`);
            //}

            let packageVersion = fileWithoutTgz.replace(distPackageName + '-', '');
            nukJSON.dependencies[distPackageName] = packageVersion;
        }

        // Update nuk.json
        await fs.writeJson('nuk.json', nukJSON, {
            spaces: '  '
        });

        // Remove __processing__ folder
        await fs.remove(`${VENDORS_FOLDER}/__processing__`);
        console.log(chalk.greenBright('the packages are installed!'));
    } catch (e) {
        console.error(e.message);
    }

})();

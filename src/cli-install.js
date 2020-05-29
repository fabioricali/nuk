#!/usr/bin/env node

const program = require('commander');
const util = require('util');
const downloadRepo = util.promisify(require('download-git-repo'));
const {REPO, TESTING} = require('./constants');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs-extra');

const VENDORS_FOLDER = 'vendors_dist';
const PROCESSING_FOLDER = '__processing__';

(async function () {

    try {
        program
            .option('-d, --destination <value>', 'destination folder')
            .parse(process.argv)
        ;

        const isTesting = program.args.length && program.args[program.args.length - 1] === TESTING;

        if (isTesting) {
            console.log('testing mode...');
            process.chdir('test/cwd');
        }

        let nukJSON = {
            dependencies: {},
            expressions: []
        }

        if (await fs.pathExists('nuk.json')) {
            nukJSON = Object.assign({}, nukJSON, await fs.readJson('nuk.json'));
        }

        let distPackages = program.args[0] + ''.trim();
        const CWD = process.cwd();

        distPackages = distPackages.split(' ');

        //console.log('program.opts()', program.opts())
        let newDestination = (program.destination || '').trim();

        for (let i = 0; i < distPackages.length; i++) {
            let distPackageExpression = distPackages[i];

            if (!distPackageExpression) continue;

            console.log(`Try to install ${distPackageExpression}...`);

            // Split expression by /
            let distPackageExpressionParts = distPackageExpression.split('/');

            // Get the package name from expression
            let distPackageName = distPackageExpressionParts[0];

            // Remove first item.. package name
            distPackageExpressionParts.shift();

            // Recompose path for getting the folder
            let packageFilesPath = distPackageExpressionParts.join('/');

            // Get tgz file using npm pack
            let tgzFile = (await exec(`npm pack ${distPackageName}`)).stdout.trim();

            // Remove extension tgz
            let fileWithoutTgz = tgzFile.split('.').slice(0, -1).join('.');

            // Move to processing folder
            await fs.move(tgzFile, `${CWD}/${VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}/${tgzFile}`, {overwrite: true});

            // Extract package
            await exec(`tar -xzf ${CWD}/${VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}/${tgzFile} -C ${CWD}/${VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}`);

            // Copy preselected folder to final destination
            await fs.copy(`${CWD}/${VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}/package/${packageFilesPath}`, `${CWD}/${VENDORS_FOLDER}/${fileWithoutTgz}/${newDestination}`);

            // Add some info to nuk.json
            // Add expression
            if (newDestination) {
                distPackageExpression += ' -d ' + newDestination;
            }
            if (!nukJSON.expressions.includes(distPackageExpression)) {
                nukJSON.expressions.push(distPackageExpression);
            }
            // Add package version
            nukJSON.dependencies[distPackageName] = fileWithoutTgz.replace(distPackageName + '-', '');
        }

        // Write nuk.json
        await fs.writeJson('nuk.json', nukJSON, {
            spaces: '  '
        });

        // Remove __processing__ folder
        await fs.remove(`${CWD}/${VENDORS_FOLDER}/__processing__`);
        console.log(chalk.greenBright('the packages are installed!'));
    } catch (e) {
        console.error(e.message);
    }

})();

#!/usr/bin/env node

const program = require('commander');
const util = require('util');
//const downloadRepo = util.promisify(require('download-git-repo'));
const {NUK_JSON_FILENAME, VENDORS_FOLDER, PROCESSING_FOLDER, REGEX_GET_ARGS, TESTING} = require('./constants');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs-extra');
const matchAll = require('string.prototype.matchall');

(async function () {

    try {
        program
            .option('-d, --destination <value>', 'destination folder')
            .parse(process.argv)
        ;

        const isTesting = program.args.length && program.args[program.args.length - 1] === TESTING;
        const packagesMap = {};
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
        
        let distPackages = program.args[0] + ''.trim();
        const CWD = process.cwd();
        let installAll = false;

        if (distPackages) {
            //console.log('#1', distPackages)
            distPackages = distPackages.split(' ');
        } else {
            distPackages = Object.assign([], nukJSON.expressions);
            //console.log('#2', distPackages)
            installAll = true;
        }

        let totalInstallation = 0;

        try {
            for (let i = 0; i < distPackages.length; i++) {

                let distPackageExpression = distPackages[i];

                //console.log('#3', distPackages)

                if (!distPackageExpression) continue;

                console.log(`expression: ${distPackageExpression}...`);

                let destinationFolder = (program.destination || '').trim();

                // Extract packageName with a possible path
                let distPackageMatchAll = [...matchAll(distPackageExpression, REGEX_GET_ARGS)];

                let packageNameWithPossiblePath = distPackageMatchAll[0][0];

                // This works when use installation from nuk.json
                // overwrite program.destination
                if (distPackageMatchAll[1] && distPackageMatchAll[1][2] === '-d') {
                    destinationFolder = distPackageMatchAll[1][3];
                }

                // Split expression by / then get possible path
                let distPackageParts = packageNameWithPossiblePath.split('/');

                // Get the package name from expression
                let distPackageName = distPackageParts[0];

                // Remove first item.. package name
                distPackageParts.shift();

                // Recompose path for getting the folder
                let packageFilesPath = distPackageParts.join('/');

                if (!packagesMap[distPackageName]) {
                    console.log(chalk.cyanBright(`get ${distPackageName} from npm...`));

                    // Get tgz file using npm pack
                    let tgzFile = (await exec(`npm pack ${distPackageName}`)).stdout.trim();

                    // Add package to map
                    packagesMap[distPackageName] = tgzFile;

                    // Move to processing folder
                    await fs.move(tgzFile, `${CWD}/${_VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}/${tgzFile}`, {overwrite: true});

                    // Extract package
                    await exec(`tar -xzf ${CWD}/${_VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}/${tgzFile} -C ${CWD}/${_VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}`);
                }

                let tgzFile = packagesMap[distPackageName];
                let fileWithoutTgz = tgzFile.split('.').slice(0, -1).join('.');

                // Copy preselected folder to final destination
                await fs.copy(`${CWD}/${_VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}/package/${packageFilesPath}`, `${CWD}/${_VENDORS_FOLDER}/${fileWithoutTgz}/${destinationFolder}`);

                // Add expression
                if (!nukJSON.expressions.includes(distPackageExpression)) {
                    nukJSON.expressions.push(distPackageExpression);
                }

                if (!nukJSON.packages[distPackageName]) {
                    nukJSON.packages[distPackageName] = {
                        folder: fileWithoutTgz
                    }
                }

                totalInstallation++;
            }
        } catch (e) {
            console.error(e.message);
        } finally {
            // Write nuk.json
            await fs.writeJson(NUK_JSON_FILENAME, nukJSON, {
                spaces: '  '
            });

            // Remove __processing__ folder
            await fs.remove(`${CWD}/${_VENDORS_FOLDER}/${PROCESSING_FOLDER}`);
            if (totalInstallation)
                console.log(chalk.greenBright('complete!'));
            else
                console.log(chalk.redBright('no packages installed!'));
        }

    } catch (e) {
        console.error(e.message);
    }

})();

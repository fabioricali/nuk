#!/usr/bin/env node

const program = require('commander');
const util = require('util');
//const downloadRepo = util.promisify(require('download-git-repo'));
const {NUK_JSON_FILENAME, NUK_JSON_LOCK_FILENAME, VENDORS_FOLDER, PROCESSING_FOLDER, REGEX_GET_INFO_FROM_TGZ, TESTING} = require('./constants');
const chalk = require('chalk');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs-extra');
//const matchAll = require('string.prototype.matchall');
const path = require('path');
const decompress = require('decompress');
const decompressTargz = require('decompress-targz');
const scopeRegex = /(@[\w-]+)\/([\w-]+)(@\d+\.\d+.\d+)?(.*)?/gm;
const {parse} = require('parse-package-name');

(async function () {

    try {
        program
            //.option('-d, --destination <value>', 'destination folder')
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
        }

        _VENDORS_FOLDER = nukJSON.folderName || _VENDORS_FOLDER;

        let distPackages = program.args.filter(item => ![TESTING, ''].includes(item));
        const CWD = process.cwd();
        let installAll = false;

        if (!distPackages.length) {
            distPackages = Object.assign([], nukJSON.expressions);
            installAll = true;
        }

        let totalInstallation = 0;

        try {
            for (let i = 0; i < distPackages.length; i++) {

                let distPackageExpression = distPackages[i];

                if (!distPackageExpression) continue;

                console.log(`expression: ${distPackageExpression}...`);

                let distPackageExpressionParsed = parse(distPackageExpression);
                //console.log(distPackageExpressionParsed)

                // Split expression by / then get possible path
                //let distPackageParts = distPackageExpression.split('/');

                // Get the package name from expression
                let distPackageNameWithPossibleVersion = distPackageExpressionParsed.name + '@' + distPackageExpressionParsed.version;// distPackageParts[0];
                //let distPackageNamePart = distPackageNameWithPossibleVersion.split('@');
                let version = distPackageExpressionParsed.version;// distPackageNamePart[1] || '';
                let distPackageName = distPackageExpressionParsed.name;// distPackageNamePart[0];

                // Remove first item... package name
                //distPackageParts.shift();

                // Recompose path for getting the folder
                let packageFilesPath = distPackageExpressionParsed.path;// distPackageParts.join('/');

                if (!packagesMap[distPackageName]) {
                    console.log(chalk.cyanBright(`get ${distPackageNameWithPossibleVersion} from npm...`));

                    // Get tgz file using npm pack
                    let tgzFile = (await exec(`npm pack ${distPackageNameWithPossibleVersion}`)).stdout.trim();

                    // Add package to map
                    packagesMap[distPackageName] = tgzFile;

                    // Move to processing folder
                    await fs.move(tgzFile, `${CWD}/${_VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}/${tgzFile}`, {overwrite: true});

                    // Extract package
                    await decompress(`${CWD}/${_VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}/${tgzFile}`, `${CWD}/${_VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}`, {
                        plugins: [
                            decompressTargz()
                        ]
                    });
                }

                let tgzFile = packagesMap[distPackageName];
                //let fileWithoutTgz = tgzFile.split('.').slice(0, -1).join('.');
                let matchInfoTgz = tgzFile.match(REGEX_GET_INFO_FROM_TGZ)
                //let fileWithoutTgz = matchInfoTgz[1];
                version = matchInfoTgz[2];

                let copyFrom = path.normalize(`${CWD}/${_VENDORS_FOLDER}/${PROCESSING_FOLDER}/${tgzFile}/package/${packageFilesPath}`);
                //console.log('copyFrom', copyFrom);
                //let statCopyFrom = await fs.lstat(copyFrom);
                //if (statCopyFrom.isFile())
                    //destinationFolder += '/' + packageFilesPath;
                    //destinationFolder += '/' + packageFilesPath;
                //let copyTo = path.normalize(`${CWD}/${_VENDORS_FOLDER}/${fileWithoutTgz}/${destinationFolder}`);
                let copyTo = path.normalize(`${CWD}/${_VENDORS_FOLDER}/${distPackageName}/${packageFilesPath}`);

                // Copy preselected folder to final destination
                await fs.copy(copyFrom, copyTo);

                // Add expression
                if (!nukJSON.expressions.includes(distPackageExpression)) {
                    nukJSON.expressions.push(distPackageExpression);
                }

                if (!nukJSONLock.packages[distPackageName]) {
                    nukJSONLock.packages[distPackageName] = {
                        //folder: fileWithoutTgz,
                        version,
                        paths: [],
                        expressions: []
                    }
                }

                if (packageFilesPath && !nukJSONLock.packages[distPackageName].paths.includes(packageFilesPath)) {
                    nukJSONLock.packages[distPackageName].paths.push(packageFilesPath);
                }

                if (!nukJSONLock.packages[distPackageName].expressions.includes(distPackageExpression)) {
                    nukJSONLock.packages[distPackageName].expressions.push(distPackageExpression);
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
            // Write nuk-lock.json
            await fs.writeJson(NUK_JSON_LOCK_FILENAME, nukJSONLock, {
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

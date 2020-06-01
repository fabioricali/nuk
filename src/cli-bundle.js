#!/usr/bin/env node

const program = require('commander');
const {VENDORS_FOLDER, TESTING} = require('./constants');
const chalk = require('chalk');
const readdirp = require('readdirp');
const concat = require('concat');
const path = require('path');
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
        const CWD = process.cwd();

        let filesJS = [];
        let filesCSS = [];
        let files = await readdirp.promise(CWD + '/' + VENDORS_FOLDER);
        files = files
            .map(file => file.path)
            .filter(file => {
                let re = /.*\.min\.(js|css)/.test(file);
                if (re) {
                    console.log(chalk.greenBright(file, 'included'));
                } else {
                    console.log(chalk.redBright(file, 'not included'));
                }

                return re;
            })
        ;

        for (let i = 0; i < files.length; i++) {
            if (path.extname(files[i]) === '.css') {
                filesCSS.push(CWD + '/' + VENDORS_FOLDER + '/' + files[i]);
            } else if (path.extname(files[i]) === '.js') {
                filesJS.push(CWD + '/' + VENDORS_FOLDER + '/' + files[i]);
            }
        }

        await concat(filesJS, CWD + '/' + VENDORS_FOLDER + '/' + 'bundle.js');
        let contentFileJS = await fs.readFile(CWD + '/' + VENDORS_FOLDER + '/' + 'bundle.js');
        contentFileJS = contentFileJS.toString().replace(/\/\/# sourceMappingURL/g, '//# sourceMappingURL_DISABLED_');
        await fs.writeFile(CWD + '/' + VENDORS_FOLDER + '/' + 'bundle.js', contentFileJS);

        await concat(filesCSS, CWD + '/' + VENDORS_FOLDER + '/' + 'bundle.css');

    } catch (e) {
        console.error(e.message);
    }

})();

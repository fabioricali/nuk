#!/usr/bin/env node

const program = require('commander');
const {version} = require('../package');
const figlet = require('figlet');
const chalk = require('chalk');

console.log(
    chalk.greenBright(
        figlet.textSync('nuk')
    )
);

program
    .version(version)
    .command('install <name>', 'install dist package')
    .command('update <name>', 'update a package to latest version')
    .command('uninstall <name>', 'uninstall dist package')
    .command('list <name>', 'files list of package')
    .command('bundle', 'create unique bundle file')
    .parse(process.argv)
;
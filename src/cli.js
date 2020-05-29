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
    .parse(process.argv)
;
//console.log(`cheese: ${program.destination}`);
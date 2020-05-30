const {spawn} = require('child_process');
const {TESTING} = require('../src/constants');
const fs = require('fs-extra');

describe('doz cli', function () {

    this.timeout(5000);

    beforeEach(function () {
        fs.removeSync('test/cwd/vendors');
        fs.removeSync('test/cwd/nuk.json');
        try {
            fs.removeSync('test/cwd/my-vendors');
        } catch (e) {

        }
    });

    describe('install', function () {

        it('install single package', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'doz',
                TESTING
            ]);

            cli.stdout.on('data', data => {
                console.log(`${data}`);
            });

            cli.stderr.on('data', data => {
                console.error(`${data}`);
                done(`${data}`);
            });

            cli.on('close', code => {
                console.log(`child process exited with code ${code}`);
                done()
            });
        });

        it('install single package with version', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'doz@2.4.7',
                TESTING
            ]);

            cli.stdout.on('data', data => {
                console.log(`${data}`);
            });

            cli.stderr.on('data', data => {
                console.error(`${data}`);
                done(`${data}`);
            });

            cli.on('close', code => {
                console.log(`child process exited with code ${code}`);
                done()
            });
        });

        it('install single package with version and determinate folder', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'doz@2.4.7/dist',
                TESTING
            ]);

            cli.stdout.on('data', data => {
                console.log(`${data}`);
            });

            cli.stderr.on('data', data => {
                console.error(`${data}`);
                done(`${data}`);
            });

            cli.on('close', code => {
                console.log(`child process exited with code ${code}`);
                done()
            });
        });

        it('install multiple dist', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'doz/dist react/umd',
                TESTING
            ]);

            cli.stdout.on('data', data => {
                console.log(`${data}`);
            });

            cli.stderr.on('data', data => {
                console.error(`${data}`);
                done(`${data}`);
            });

            cli.on('close', code => {
                console.log(`child process exited with code ${code}`);
                done()
            });
        });

        it('install single package with destination folder', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'doz',
                '-d mydist',
                TESTING
            ]);

            cli.stdout.on('data', data => {
                console.log(`${data}`);
            });

            cli.stderr.on('data', data => {
                console.error(`${data}`);
                done(`${data}`);
            });

            cli.on('close', code => {
                console.log(`child process exited with code ${code}`);
                done()
            });
        });

        it('install all from nuk.json', function (done) {

            fs.writeJsonSync('test/cwd/nuk.json', {
                expressions: [
                    "doz@2.4.7/dist -d thedest",
                    "doz/dist -d mydest"
                ]
            });

            const cli = spawn('node', [
                'src/cli.js',
                'install',
                '',
                TESTING
            ]);

            cli.stdout.on('data', data => {
                console.log(`${data}`);
            });

            cli.stderr.on('data', data => {
                console.error(`${data}`);
            });

            cli.on('close', code => {
                console.log(`child process exited with code ${code}`);
                done()
            });
        });

        it('install all from nuk.json same package different folder to getting', function (done) {

            fs.writeJsonSync('test/cwd/nuk.json', {
                expressions: [
                    "react/umd -d umd",
                    "react/cjs -d cjs"
                ]
            });

            const cli = spawn('node', [
                'src/cli.js',
                'install',
                '',
                TESTING
            ]);

            cli.stdout.on('data', data => {
                console.log(`${data}`);
            });

            cli.stderr.on('data', data => {
                console.error(`${data}`);
            });

            cli.on('close', code => {
                console.log(`child process exited with code ${code}`);
                done()
            });
        });

        it('custom vendors folder', function (done) {

            fs.writeJsonSync('test/cwd/nuk.json', {
                folderName: 'my-vendors',
                expressions: [
                    "react/umd -d umd",
                    "react/cjs -d cjs"
                ]
            });

            const cli = spawn('node', [
                'src/cli.js',
                'install',
                '',
                TESTING
            ]);

            cli.stdout.on('data', data => {
                console.log(`${data}`);
            });

            cli.stderr.on('data', data => {
                console.error(`${data}`);
            });

            cli.on('close', code => {
                console.log(`child process exited with code ${code}`);
                done()
            });
        });
    });
});
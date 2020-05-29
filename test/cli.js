const {spawn} = require('child_process');
const {TESTING} = require('../src/constants');
const fs = require('fs-extra');

describe('doz cli', function () {

    this.timeout(5000);

    beforeEach(function () {
        fs.removeSync('test/cwd/my-app');
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
                done();
            });

        });

    });

});
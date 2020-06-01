const {spawn} = require('child_process');
const {TESTING} = require('../src/constants');
const fs = require('fs-extra');

describe('nuk', function () {

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
                'doz/dist', 'react/umd',
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

        it('install multiple file same package', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'swiper/js/swiper.min.js', 'swiper/css',
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

        it('install multiple file same package 2', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'swiper/js/swiper.min.js', 'swiper/css/swiper.min.css',
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

        it('install multiple file same package 3', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'swiper/js/swiper.min.js -d myjs', 'swiper/css/swiper.min.css -d mycss',
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

    describe('uninstall', function () {
        it('uninstall react', function (done) {

            fs.writeJsonSync('test/cwd/nuk.json', {
                expressions: [
                    "doz@2.4.7/dist -d thedest",
                    "doz/dist -d mydest",
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

                const cli2 = spawn('node', [
                    'src/cli.js',
                    'uninstall',
                    'react',
                    TESTING
                ]);

                cli2.stdout.on('data', data => {
                    console.log(`${data}`);
                });

                cli2.stderr.on('data', data => {
                    console.error(`${data}`);
                });

                cli2.on('close', code => {
                    console.log(`child process exited with code ${code}`);
                    done()
                });
            });
        });

        it('uninstall empty name', function (done) {

            fs.writeJsonSync('test/cwd/nuk.json', {
                expressions: [
                    "doz@2.4.7/dist -d thedest",
                    "doz/dist -d mydest",
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

                const cli2 = spawn('node', [
                    'src/cli.js',
                    'uninstall',
                    '',
                    TESTING
                ]);

                cli2.stdout.on('data', data => {
                    console.log(`${data}`);
                });

                cli2.stderr.on('data', data => {
                    console.error(`${data}`);
                });

                cli2.on('close', code => {
                    console.log(`child process exited with code ${code}`);
                    done()
                });
            });
        });
    });

    describe('list', function () {
        it('retrieve a package', function (done) {


            const cli = spawn('node', [
                'src/cli.js',
                'list',
                'doz',
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

    describe('bundle', function () {
        it('create bundle files', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'swiper/js/swiper.min.js',
                'swiper/css',
                "react/umd -d umd",
                "react/cjs -d cjs",
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
                const cli2 = spawn('node', [
                    'src/cli.js',
                    'bundle',
                    TESTING
                ]);

                cli2.stdout.on('data', data => {
                    console.log(`${data}`);
                });

                cli2.stderr.on('data', data => {
                    console.error(`${data}`);
                });

                cli2.on('close', code => {
                    console.log(`child process exited with code ${code}`);
                    done()
                });
            });
        });
        it('create bundle files with bundleFiles', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'swiper/js/swiper.min.js',
                'swiper/css',
                "react/umd -d umd",
                "react/cjs -d cjs",
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

                let nukJSON = fs.readJsonSync('test/cwd/nuk.json');
                nukJSON.bundleFiles = [
                    'swiper-5.4.1/swiper.min.css',
                    'react-16.13.1/umd/react.production.min.js'
                ];

                fs.writeJsonSync('test/cwd/nuk.json', nukJSON);

                const cli2 = spawn('node', [
                    'src/cli.js',
                    'bundle',
                    TESTING
                ]);

                cli2.stdout.on('data', data => {
                    console.log(`${data}`);
                });

                cli2.stderr.on('data', data => {
                    console.error(`${data}`);
                });

                cli2.on('close', code => {
                    console.log(`child process exited with code ${code}`);
                    done()
                });
            });
        });

        it('create bundle files with bundleFiles but different bundles', function (done) {
            const cli = spawn('node', [
                'src/cli.js',
                'install',
                'swiper/js/swiper.min.js',
                'swiper/css',
                "react/umd -d umd",
                "react/cjs -d cjs",
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

                let nukJSON = fs.readJsonSync('test/cwd/nuk.json');
                nukJSON.bundleFiles = {
                    bundle1: [
                        'swiper-5.4.1/swiper.min.css',
                        'react-16.13.1/umd/react.production.min.js'
                    ],
                    bundle2: [
                        'react-16.13.1/umd/react.profiling.min.js'
                    ]
                };

                fs.writeJsonSync('test/cwd/nuk.json', nukJSON);

                const cli2 = spawn('node', [
                    'src/cli.js',
                    'bundle',
                    TESTING
                ]);

                cli2.stdout.on('data', data => {
                    console.log(`${data}`);
                });

                cli2.stderr.on('data', data => {
                    console.error(`${data}`);
                });

                cli2.on('close', code => {
                    console.log(`child process exited with code ${code}`);
                    done()
                });
            });
        });
    });
});
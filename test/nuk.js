const {spawn} = require('child_process');
const {TESTING} = require('../src/constants');
const fs = require('fs-extra');

describe('nuk', function () {

    this.timeout(5000);

    beforeEach(function () {
        fs.removeSync('test/cwd/vendors');
        fs.removeSync('test/cwd/nuk.json');
        fs.removeSync('test/cwd/nuk-lock.json');
        try {
            fs.removeSync('test/cwd/my-vendors');
        } catch (e) {

        }
    });

    describe('install', function () {

        it('install single package', function (done) {
            const cli = spawn('node', [
                'src/nuk.js',
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

        it('install single package with namespace', function (done) {
            const cli = spawn('node', [
                'src/nuk.js',
                'install',
                '@videojs/http-streaming',
                '@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js',
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
                'src/nuk.js',
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
                'src/nuk.js',
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
                'src/nuk.js',
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
                'src/nuk.js',
                'install',
                'swiper/swiper.min.js', 'swiper/swiper.min.css',
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
                'src/nuk.js',
                'install',
                'swiper/swiper.min.js', 'swiper/swiper.min.css',
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

        it.skip('install multiple file same package 3', function (done) {
            const cli = spawn('node', [
                'src/nuk.js',
                'install',
                'swiper/swiper.min.js -d myjs', 'swiper/swiper.min.css -d mycss',
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

        it.skip('install single package with destination folder', function (done) {
            const cli = spawn('node', [
                'src/nuk.js',
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
                    "doz@2.4.7/dist",
                    "doz/dist"
                ]
            });

            const cli = spawn('node', [
                'src/nuk.js',
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
                    "react/umd",
                    "react/cjs"
                ]
            });

            const cli = spawn('node', [
                'src/nuk.js',
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
                    "react/umd",
                    "react/cjs"
                ]
            });

            const cli = spawn('node', [
                'src/nuk.js',
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
                    "doz@2.4.7/dist",
                    "doz/dist",
                    "react/umd",
                    "react/cjs"
                ]
            });

            const cli = spawn('node', [
                'src/nuk.js',
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
                    'src/nuk.js',
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
        it('uninstall all doz version', function (done) {

            fs.writeJsonSync('test/cwd/nuk.json', {
                expressions: [
                    "doz@2.4.7/dist",
                    "doz/dist",
                    "react/umd",
                    "react/cjs"
                ]
            });

            const cli = spawn('node', [
                'src/nuk.js',
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
                    'src/nuk.js',
                    'uninstall',
                    'doz',
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
                    "doz@2.4.7/dist",
                    "doz/dist",
                    "react/umd",
                    "react/cjs"
                ]
            });

            const cli = spawn('node', [
                'src/nuk.js',
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
                    'src/nuk.js',
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
                'src/nuk.js',
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
                'src/nuk.js',
                'install',
                'swiper/swiper.min.js',
                'swiper/swiper.min.css',
                "react/umd",
                "react/cjs",
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
                    'src/nuk.js',
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
                'src/nuk.js',
                'install',
                'swiper/swiper.min.js',
                'swiper/swiper.min.css',
                "react/umd",
                "react/cjs",
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
                    'swiper/swiper.min.css',
                    'react/umd/react.production.min.js'
                ];

                fs.writeJsonSync('test/cwd/nuk.json', nukJSON);

                const cli2 = spawn('node', [
                    'src/nuk.js',
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
                'src/nuk.js',
                'install',
                'swiper/swiper.min.js',
                'swiper/swiper.min.css',
                "react/umd",
                "react/cjs",
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
                        'swiper/swiper.min.css',
                        'react/umd/react.production.min.js'
                    ],
                    bundle2: [
                        'react/umd/react.profiling.min.js',
                        'swiper/swiper.min.js',
                    ]
                };

                fs.writeJsonSync('test/cwd/nuk.json', nukJSON);

                const cli2 = spawn('node', [
                    'src/nuk.js',
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
        describe('update', function () {
            it('update to latest version (all resources of a package)', function (done) {
                const cli = spawn('node', [
                    'src/nuk.js',
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
                    const cli2 = spawn('node', [
                        'src/nuk.js',
                        'update',
                        'doz',
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

            it('update to latest version (dist folder only)', function (done) {
                const cli = spawn('node', [
                    'src/nuk.js',
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
                    const cli2 = spawn('node', [
                        'src/nuk.js',
                        'update',
                        'doz',
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
});
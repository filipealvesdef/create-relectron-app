#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const devDependencies = [
    '@babel/core',
    '@babel/plugin-proposal-class-properties',
    '@babel/preset-env',
    '@babel/preset-react',
    'babel-loader',
    'concurrently',
    'electron',
    'react',
    'react-dom',
    'webpack',
    'webpack-cli',
    'webpack-dev-server',
    'https://github.com/filipealvesdef/webpack-electron-reload',
];

const scripts = {
    'react-watcher': 'webpack serve --config webpack.react.config.js --env dev',
    'electron-watcher': 'webpack --watch --config webpack.electron.config.js --env dev',
    'start': 'concurrently --kill-others \"yarn:react-watcher\" \"yarn:electron-watcher\"'
};


const baseDir = path.join(__dirname, 'files');

const rCopy = dir => {
    const tgtDir = path.join(process.cwd(), path.relative(baseDir, dir));
    fs.readdir(dir, (err, files) => {
        files.forEach(f => {
            const srcPath = path.join(dir, f);
            const tgtPath = path.join(tgtDir, f);
            if (fs.lstatSync(srcPath).isDirectory()) {
                fs.mkdirSync(tgtPath);
                rCopy(path.join(dir, f));
            } else {
                fs.copyFileSync(srcPath, tgtPath);
            }
        })
    });
};

const init = appName => {
    const cwd = process.cwd();
    const appDir = path.join(cwd, appName);
    if (fs.existsSync(appDir)) {
        console.error('This path already exists.');
        return;
    }
    fs.mkdirSync(appDir);
    process.chdir(appDir);
    cp.spawnSync('yarn', ['init', '--yes'], {
        stdio: 'inherit',
        shell: true,
    });
    const srcFilesDir = path.join(baseDir);
    const packagePath = path.join(process.cwd(), 'package.json');
    const package = JSON.parse(fs.readFileSync(packagePath).toString());
    package.scripts = scripts;
    fs.writeFileSync(packagePath, JSON.stringify(package, null, 4));
    rCopy(srcFilesDir);
    const args = ['add', '--dev'];
    cp.spawnSync('yarn', args.concat(devDependencies), { 
        stdio: 'inherit',
        shell: true,
    });
};

const argv = yargs(hideBin(process.argv)).check((argv, options) => {
    if (argv._.length > 1) {
        throw new Error('You must pass only 1 name to your app');
    } else if (!argv._.length) {
        throw new Error('You must pass at least 1 name to your app');
    } else {
        return true;
    }
}).argv;

const appName = argv._[0];
init(appName);
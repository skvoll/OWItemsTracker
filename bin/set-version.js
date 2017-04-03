"use strict";

const fs = require('fs');
const packageJson = require('./../package.json');

let platforms = ['ios', 'android',];
let args = {}, command = help;

if (process.argv.length > 2) {
    process.argv.map((arg, index) => {
        if (index < 2) {
            return;
        }

        if (arg.indexOf('-') === 0) {
            args[arg[1]] = arg.slice(2);
            if (args[arg[1]] === '') {
                args[arg[1]] = true;
            }

            return;
        }

        if (!args.version) {
            args.version = arg;
            command = setVersion;
        }
    });
}

command(args);

function error(error, exit = true) {
    console.log(`error: ${error}`);

    if (exit) {
        process.exit();
    }
}

function help(args = null) {
    console.log(``);
    console.log(`commands:`);
    console.log(`  patch: increment patch`);
    console.log(`  minor: increment minor and set patch to 0`);
    console.log(`  major: increment major and set minor and patch to 0`);
    console.log(``);
    console.log(`  "MAJOR.MINOR.PATCH" to set version directly`);
    // console.log(`params:`);
    // console.log(`  -p: platform one of [${platforms.join(', ')}]. default all.`);
    console.log(``);
}

function setVersion(args = null) {
    let version, platform;

    if (['patch', 'minor', 'major',].indexOf(args.version) !== -1) {
        version = args.version;
    }

    if (!version) {
        if (args.version && args.version.search(/\d+\.\d+\.\d+/) !== -1) {
            version = args.version;
        } else {
            error('wrong version format. it should be "MAJOR.MINOR.PATCH" or "patch|minor|major" for increment.');
        }
    }

    if (args['p']) {
        if (platforms.indexOf(args['p']) !== -1) {
            platform = [args['p']];
        } else {
            error(`wrong platform. should be one of [${platforms.join(', ')}].`);
        }
    } else {
        platform = platforms;
    }

    switch (version) {
        case 'patch':
            version = packageJson.version.split('.');
            version[2]++;
            version = version.join('.');
            break;
        case 'minor':
            version = packageJson.version.split('.');
            version[1]++;
            version[2] = 0;
            version = version.join('.');
            break;
        case 'major':
            version = packageJson.version.split('.');
            version[0]++;
            version[1] = 0;
            version[2] = 0;
            version = version.join('.');
            break;
    }

    packageJson.version = version;

    platform.map((p) => {
        switch (p) {
            case 'ios':
                setVersionIOS(version);
                break;
            case 'android':
                setVersionANDROID(version);
                break;
        }
    });

    fs.writeFileSync('./../package.json', JSON.stringify(packageJson, null, 2));

    let config = fs.readFileSync('./../src/config.js', 'utf-8');
    config = config.replace(
        /static VERSION = '.*';/,
        `static VERSION = '${version}';`
    );
    fs.writeFileSync('./../src/config.js', config);
}

function setVersionIOS(version) {
    let plist = fs.readFileSync(`./../ios/${packageJson.name}/Info.plist`, 'utf-8');
    plist = plist.replace(
        /<key>CFBundleShortVersionString<\/key>\n([ \t]*)<string>.*<\/string>/,
        `<key>CFBundleShortVersionString</key>\n$1<string>${version}</string>`
    );
    plist = plist.replace(
        /<key>CFBundleVersion<\/key>\n([ \t]*)<string>(\d*)<\/string>/,
        (match, match1, match2) => {
            return `<key>CFBundleVersion</key>\n${match1}<string>${parseInt(match2) + 1}</string>`;
        }
    );
    fs.writeFileSync(`./../ios/${packageJson.name}/Info.plist`, plist);
}

function setVersionANDROID(version) {
    let buildGradle = fs.readFileSync(`./../android/app/build.gradle`, 'utf-8');
    buildGradle = buildGradle.replace(
        /versionCode (\d*)/,
        (match, match1) => {
            return `versionCode ${parseInt(match1) + 1}`;
        }
    );
    buildGradle = buildGradle.replace(
        /versionName .*/,
        `versionName "${version}"`
    );
    fs.writeFileSync(`./../android/app/build.gradle`, buildGradle);

    let manifest = fs.readFileSync(`./../android/app/src/main/AndroidManifest.xml`, 'utf-8');
    manifest = manifest.replace(
        /android:versionCode="(\d*)"/,
        (match, match1) => {
            return `android:versionCode="${parseInt(match1) + 1}"`;
        }
    );
    manifest = manifest.replace(
        /android:versionName=".*"/,
        `android:versionName="${version}"`
    );
    fs.writeFileSync(`./../android/app/src/main/AndroidManifest.xml`, manifest);
}

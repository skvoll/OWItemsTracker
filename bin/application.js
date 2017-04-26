"use strict";

const fs = require('fs');
const logger = require('./logger');

let packageJson = require('./../package.json');

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

const setVersion = function (args = null) {
    if (!args['v'] || typeof args['v'] !== 'string') {
        logger.fatal('version is missing');
    }

    let platforms = ['ios', 'android',], version, platform;

    if (['patch', 'minor', 'major',].indexOf(args['v']) !== -1) {
        version = args['v'];
    }

    if (!version) {
        if (args['v'] && args['v'].search(/\d+\.\d+\.\d+/) !== -1) {
            version = args['v'];
        } else {
            logger.fatal('wrong version format. it should be "MAJOR.MINOR.PATCH" or "patch|minor|major" for increment.');
        }
    }

    if (args['p']) {
        if (platforms.indexOf(args['p']) !== -1) {
            platform = [args['p']];
        } else {
            logger.fatal(`wrong platform. should be one of [${platforms.join(', ')}].`);
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

    platform.map(p => {
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
    config = config.replace(
        /static SHOW_NEWS = .*;/,
        `static SHOW_NEWS = false;`
    );
    fs.writeFileSync('./../src/config.js', config);

    logger.success(`application version setted to '${version}'`);
    logger.success(`config SHOW_NEWS setted to 'false'`);
};

module.exports = {
    setVersion: setVersion,
};

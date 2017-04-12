#!/usr/bin/env node

"use strict";

const fs = require('fs');
const packageJson = require('./../package.json');
let items = require('./../src/data/items.json');

let args = {}, command = help;

if (process.argv.length > 2) {
    process.argv.map((arg, index) => {
        if (index < 2) {
            return;
        }

        if (index === 2) {
            switch (arg) {
                case 'help':
                    command = help;
                    break;
                case 'set-version':
                    command = setVersion;
                    break;
                case 'check-items':
                    command = checkItems;
                    break;
                case 'save-items':
                    command = saveItems;
                    break;
                case 'import-csv':
                    command = importCsv;
                    break;
                case 'generate-translations':
                    command = generateTranslations;
                    break;
                case 'rename':
                    command = rename;
                    break;
                case 'temp':
                    command = temp;
                    break;
                default:
                    help();
                    process.exit();
                    break;
            }

            return;
        }

        if (arg.indexOf('-') === 0) {
            args[arg[1]] = arg.slice(2);
            if (args[arg[1]] === '') {
                args[arg[1]] = true;
            }
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

function makeUid(type, string, hero = null) {
    let uid = [type];

    if (hero) {
        uid.push(hero);
    }

    string.toUpperCase().split('').map((c) => uid.push(c.charCodeAt(0)));

    return uid.join('-');
}

// commands
function help(args = {}) {
    console.log(``);
    console.log(`commands:`);
    console.log(`  help: print this message`);
    console.log(`  set-version: set or increment app version`);
    console.log(`    -v%MAJOR.MINOR.PATCH%|patch|minor|major: version`);
    console.log(`  check-items: check items translations and assets`);
    console.log(`    -l%language%: language (if not setted translations check will be skipped)`);
    console.log(`  save-items: save items from json to executable`);
    console.log(`    -c: check before save`);
    console.log(`    -l%language%: language for check if '-c' is setted`);
    console.log(`  import-csv: import items from csv`);
    console.log(`    -f%path%: path to file`);
    console.log(`    -c: check before save`);
    console.log(`    -l%language%: language for check if '-c' is setted`);
    console.log(`  generate-translations: generate/update translations from items names`);
    console.log(`    -l%language%: language`);
    console.log(`  rename: rename files to uid`);
    console.log(`    -p%path%: path to files`);
    console.log(`    -T%TYPE%: item type`);
    console.log(`    -H%HERO%: item hero`);
    console.log(``);
}

function setVersion(args = null) {
    if (!args['v'] || typeof args['v'] !== 'string') {
        error('version is missing');
    }

    let setVersionIOS = function(version) {
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
    };

    let setVersionANDROID = function(version) {
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
    };

    let platforms = ['ios', 'android',], version, platform;

    if (['patch', 'minor', 'major',].indexOf(args['v']) !== -1) {
        version = args['v'];
    }

    if (!version) {
        if (args['v'] && args['v'].search(/\d+\.\d+\.\d+/) !== -1) {
            version = args['v'];
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
    config = config.replace(
        /static SHOW_NEWS = .*;/,
        `static SHOW_NEWS = false;`
    );
    fs.writeFileSync('./../src/config.js', config);
}

function checkItems(args = {}, r = false) {
    let translations, result = true;

    if (args['l']) {
        if (typeof args['l'] !== 'string') {
            error('language is missing');
        }

        translations = `./../src/translations/${args['l']}.items.json`;

        if (!fs.existsSync(translations)) {
            error(`'${args['l']}' translations does not exists`);
        }

        translations = require(translations);
    }

    Object.values(items).map((item) => {
        if (['SPRAY', 'ICON',].indexOf(item.type) !== -1) {
            if (!fs.existsSync(`./../src/assets/${item.type.toLowerCase()}s/${item.uid}.png`)) {
                result = false;
                console.log(`asset for ${item.type} '${item.name}'(${item.uid}): does not exists`);
            }

            if (translations) {
                if (translations[item.name] === undefined) {
                    result = false;
                    console.log(`${args['l']} translation for${(item.hero ? ` ${item.hero}` : '')} ${item.type} '${item.name}': does not exists`);
                }
            }
        }
    });

    if (r === true) {
        return result;
    }

    console.log(`items checked: ${(result ? 'success' : 'failed')}`);
}

function saveItems(args = {}) {
    if (args['c'] && !checkItems(args, true)) {
        error('save canceled');
    }

    let output = `// THIS FILE GENERATED BY IMPORT COMMAND\n// DO NOT MODIFY\n\n`;

    fs.writeFileSync('./../src/data/items.json', JSON.stringify(items, null, 2));

    output += `import Items from './../Items';\nimport Events from './../Events';\nimport Heroes from './../Heroes';\n\nexport default {\n`;

    for (let i in items) if (items.hasOwnProperty(i)) {
        output += `    '${i}': {\n`;
        output += `        uid: '${items[i].uid}',\n`;
        if (items[i].type === 'ICON') {
            output += `        source: require('./../assets/icons/${items[i].uid}.png'),\n`;
        }
        if (items[i].type === 'SPRAY') {
            output += `        source: require('./../assets/sprays/${items[i].uid}.png'),\n`;
        }
        output += `        default: ${items[i].default},\n`;
        output += `        name: \`${items[i].name}\`,\n`;
        output += `        type: Items.TYPE.${items[i].type},\n`;
        output += `        rarity: Items.RARITY.${items[i].rarity},\n`;
        output += `        hero: ${items[i].hero ? 'Heroes.' + items[i].hero : false},\n`;
        output += `        price: ${items[i].price ? 'Items.PRICE.' + (!items[i].event || items[i].event === 'GENERAL' ? 'DEFAULT' : 'EVENT') + `[Items.RARITY.${items[i].rarity}]` : false},\n`;
        output += `        event: ${items[i].event ? 'Events.' + items[i].event : false},\n`;
        output += `    },\n`;
    }

    output += `};\n`;

    fs.writeFileSync('./../src/data/items.js', output);

    console.log('items saved');
}

function importCsv(args = {}) {
    let addedCount = 0, skippedCount = 0;

    if (!args['f'] || typeof args['f'] !== 'string') {
        error('file is missing');
    }

    if (!fs.existsSync(args['f'])) {
        error(`'${args['f']}' does not exists`);
    }

    fs.readFileSync(args['f'], 'utf-8').split('\n').map((item) => {
        item = item.split(';');

        if (item.length === 0) {
            return;
        }

        item[6] = item[6].replace('\r', '');

        item[4] = item[4] === 'false' ? false : item[4];
        item[5] = item[5] === 'true';
        item[6] = item[6] === 'false' ? false : item[6];

        item = {
            uid: makeUid(item[2], item[1], item[4] || null),
            default: item[0] === 'true',
            name: item[1],
            type: item[2],
            rarity: item[3],
            hero: item[4],
            price: item[5],
            event: item[6],
        };

        if (items[item.uid]) {
            skippedCount++;

            console.log(`${(item.hero ? `${item.hero} ` : '')}${item.type} '${item.name}': already exists`);
        } else {
            addedCount++;

            items[item.uid] = item;

            console.log(`${(item.hero ? `${item.hero} ` : '')}${item.type} '${item.name}': added`);
        }
    });

    console.log(
        `${(addedCount > 0 ? `${addedCount} item(s) added` : '')}${(skippedCount > 0 ? ` / ${skippedCount} items skipped` : '')}`
    );

    saveItems(args);
}

function generateTranslations(args = {}) {
    if (!args['l'] || typeof args['l'] !== 'string') {
        error('language is missing');
    }

    let translations = `./../src/translations/${args['l']}.items.json`, count = 0;

    if (!fs.existsSync(translations)) {
        console.log(`'${args['l']}' translations does not exists and will be created`);

        translations = {};
    } else {
        translations = require(translations);
    }

    Object.values(items).map((item) => {
        if (!translations[item.name]) {
            count++;

            translations[item.name] = item.name;

            console.log(`translation for${(item.hero ? ` ${item.hero}` : '')} ${item.type} '${item.name}': added`);
        }
    });

    if (count > 0) {
        fs.writeFileSync(`./../src/translations/${args['l']}.items.json`, JSON.stringify(translations, null, 2));

        console.log(`${count} translation(s) added`);
    } else {
        console.log('nothing to update');
    }
}

function rename(args = {}) {
    if (!args['p'] || typeof args['p'] !== 'string') {
        error('path is missing');
    }

    if (!fs.existsSync(args['p']) || !fs.lstatSync(args['p']).isDirectory()) {
        error(`'${args['p']}' does not exists or not a directory`);
    }

    if (!args['T'] || typeof args['T'] !== 'string') {
        error('item type is missing');
    }

    let type = args['T'].toUpperCase(), hero, uid, count = 0;

    if (args['H']) {
        if (typeof args['T'] !== 'string') {
            error('hero is missing');
        }

        hero = args['H'].toUpperCase();
    }

    fs.readdirSync(args['p']).map((file) => {
        count++;
        uid = makeUid(type, file.replace('.png', ''), hero);

        fs.renameSync(args['p'] + '/' + file, args['p'] + '/' + uid + '.png');
        console.log(`${file} -> ${uid}.png`);
    });

    console.log(`${count} file(s) renamed`);
}

function temp(args = {}) {
    error('command is not realised');
}

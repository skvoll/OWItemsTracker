"use strict";

const fs = require('fs');
let items = require('./../src/data/items.json');
let translations = {};

const ASSOCIATIONS = {
    'Ana': 'ANA',
    'Bastion': 'BASTION',
    'D.Va': 'DVA',
    'Genji': 'GENJI',
    'Hanzo': 'HANZO',
    'Junkrat': 'JUNKRAT',
    'Lúcio': 'LUCIO',
    'McCree': 'MCCREE',
    'Mei': 'MEI',
    'Mercy': 'MERCY',
    'Pharah': 'PHARAH',
    'Reaper': 'REAPER',
    'Reinhardt': 'REINHARDT',
    'Roadhog': 'ROADHOG',
    'Soldier: 76': 'SOLDIER76',
    'Sombra': 'SOMBRA',
    'Symmetra': 'SYMMETRA',
    'Torbjörn': 'TORBJORN',
    'Tracer': 'TRACER',
    'Widowmaker': 'WIDOWMAKER',
    'Winston': 'WINSTON',
    'Zarya': 'ZARYA',
    'Zenyatta': 'ZENYATTA',

    'Icon': 'ICON',
    'Spray': 'SPRAY',
    'Voice Line': 'VOICE_LINE',
    'Victory Pose': 'VICTORY_POSE',
    'Emote': 'EMOTE',
    'Heroic Intro': 'HIGHLIGHT_INTRO',
    'Skin': 'SKIN',

    'Common': 'COMMON',
    'Rare': 'RARE',
    'Epic': 'EPIC',
    'Legendary': 'LEGENDARY',

    'SUMMER_GAMES_2016': 'SUMMER_GAMES_2016',
    'JUNKENSTEINS_REVENGE_2016': 'JUNKENSTEINS_REVENGE_2016',
    'WINTER_WONDERLAND_2016': 'WINTER_WONDERLAND_2016',
    'YEAR_OF_THE_ROOSTER_2017': 'YEAR_OF_THE_ROOSTER_2017',
};

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

    string.split('').map((c) => uid.push(c.charCodeAt(0)));

    return uid.join('-');
}

function save() {
    let output, item;

    fs.writeFileSync('./../src/data/items.json', JSON.stringify(items, null, 2));

    output = `import Items from './../Items';\nimport Events from './../Events';\nimport Heroes from './../Heroes';\n\nexport default {\n`;

    for (let i in items) if (items.hasOwnProperty(i)) {
        item = items[i];

        output += `    '${i}': {\n`;
        output += `        uid: '${item.uid}',\n`;
        if (item.type === 'ICON') {
            output += `        source: require('./../assets/icons/${item.uid}.png'),\n`;
        }
        if (item.type === 'SPRAY') {
            output += `        source: require('./../assets/sprays/${item.uid}.png'),\n`;
        }
        output += `        default: ${item.default},\n`;
        output += `        name: \`${item.name}\`,\n`;
        output += `        type: Items.TYPE.${item.type},\n`;
        output += `        rarity: Items.RARITY.${item.rarity},\n`;
        output += `        hero: ${item.hero ? 'Heroes.' + item.hero : false},\n`;
        output += `        price: ${item.price ? 'Items.PRICE.' + (!item.event || item.event === 'GENERAL' ? 'DEFAULT' : 'EVENT') + `[Items.RARITY.${item.rarity}]` : false},\n`;
        output += `        event: ${item.event ? 'Events.' + item.event : false},\n`;
        output += `    },\n`;
    }

    output += `};\n`;

    fs.writeFileSync('./../src/data/items.js', output);
}

function saveTranslations(locale = null) {
    let output = {};

    if (locale) {
        try {
            fs.accessSync(`./../src/translations/${locale}.items.json`);
            output = require(`./../src/translations/${locale}.items.json`);
        } catch (err) {
            console.log(`file '${locale}.items.json' not found and will be create`);
        }
    }

    for (let i in translations) if (translations.hasOwnProperty(i)) {
        output[i] = translations[i];
    }

    output = JSON.stringify(output, null, 2);

    if (locale) {
        fs.writeFileSync(`./../src/translations/${locale}.items.json`, output);
    } else {
        console.log(output);
    }
}

function parseGeneralItems(path, isTranslations = false, locale = null) {
    let parseFiles = (files, isDefault, type, rarity, hero, price, event) => {
        let uid, name;

        files.map((file) => {
            name = file.replace('.dds', '');
            uid = makeUid(type, name);

            translations[name] = name;

            if (items[uid] !== undefined) {
                if (items[uid].name !== name) {
                    console.log(`${name}: changed`);
                    console.log(`    name: ${items[uid].name} -> ${name}`);
                    items[uid].name = name;
                }
            } else {
                console.log(`${name}: added`);

                items[uid] = {
                    uid: uid,
                    default: isDefault,
                    name: name,
                    type: type,
                    rarity: rarity,
                    hero: hero,
                    price: price,
                    event: event,
                };
            }
        });
    };

    parseFiles(
        fs.readdirSync(path + '/Icon'),
        false,
        'ICON',
        'COMMON',
        false,
        false,
        "GENERAL"
    );

    parseFiles(
        fs.readdirSync(path + '/Spray'),
        false,
        'SPRAY',
        'COMMON',
        false,
        true,
        "GENERAL"
    );

    if (isTranslations) {
        saveTranslations(locale);
    } else {
        save();
    }
}

function parseHeroesItems(path, isTranslations = false, locale = null) {
    let file = fs.readFileSync(path, 'utf-8'), lines = file.split('\n');
    let isAchievement = false, isDefault = false, uid, name, type, rarity, hero, price = null, event = null;

    lines.map((line) => {
        line = line.replace('\r', '');

        if (line.indexOf(`\t\t`) === 0) {
            line = line.split(' (');

            name = line.shift().replace(`\t\t`, '');

            if (isDefault && name === 'RANDOM') {
                return;
            }

            line = line[0].split(' ');

            rarity = ASSOCIATIONS[line.shift()];

            type = line.join(' ').replace(')', '');

            if (type === 'Weapon Skin') {
                return;
            }

            type = ASSOCIATIONS[type];

            price = type !== 'ICON';

            if (isDefault || isAchievement) {
                price = false;
            }

            uid = makeUid(type, name, hero);

            translations[name] = name;

            if (items[uid] !== undefined) {
                if (items[uid].name !== name) {
                    console.log(`${name}: changed`);
                    console.log(`    name: ${items[uid].name} -> ${name}`);
                    items[uid].name = name;
                }
            } else {
                console.log(`${name}: added`);

                items[uid] = {
                    uid: uid,
                    default: type === 'VOICE_LINE' ? false : isDefault,
                    name: name,
                    type: type,
                    rarity: rarity,
                    hero: hero,
                    price: price,
                    event: event,
                };
            }

            return;
        }

        if (line.indexOf(`\t`) === 0) {
            if (line.indexOf(`\tACHIEVEMENT`) === 0) {
                isAchievement = true;
                isDefault = false;
                event = false;

                return;
            }
            if (line.indexOf(`\tSTANDARD_COMMON`) === 0) {
                isAchievement = false;
                isDefault = true;
                event = false;

                return;
            }
            if (line.indexOf(`\tCOMMON`) === 0) {
                isAchievement = false;
                isDefault = false;
                event = false;

                return;
            }

            event = line.split(' ')[0].replace(`\t`, '');

            if (!ASSOCIATIONS[event]) {
                isAchievement = false;
                isDefault = false;
                event = false;

                return;
            }

            isAchievement = false;
            isDefault = false;
            event = ASSOCIATIONS[event];
        }

        if (line.indexOf('Cosmetics for ') === 0) {
            hero = line.replace('Cosmetics for ', '');
            hero = ASSOCIATIONS[hero];
        }
    });

    if (isTranslations) {
        saveTranslations(locale);
    } else {
        save();
    }
}

module.exports = (path = null, isTranslations = false, locale = null) => {
    if (path === null) {
        save();

        return;
    }

    if (fs.lstatSync(path).isDirectory()) {
        parseGeneralItems(path, isTranslations, locale);
    } else {
        parseHeroesItems(path, isTranslations, locale);
    }
};

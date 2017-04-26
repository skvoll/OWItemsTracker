#!/usr/bin/env node --harmony

"use strict";

const logger = require('./logger');
const application = require('./application');
const items = require('./items');
const i18n = require('./i18n');

let args = {}, command = temp;

if (process.argv.length > 2) {
    process.argv.map((arg, index) => {
        if (index < 2) {
            return;
        }

        if (index === 2) {
            switch (arg) {
                case 'set-version':
                case 'ver':
                    command = application.setVersion;
                    break;
                case 'items-check':
                case 'items-c':
                    command = items.check;
                    break;
                case 'items-import':
                case 'items-i':
                    command = items.import;
                    break;
                case 'items-save':
                case 'items-s':
                    command = items.save;
                    break;
                case 'i18n-export':
                case 'i18n-e':
                    command = i18n.export;
                    break;
                case 'i18n-import':
                case 'i18n-i':
                    command = i18n.import;
                    break;
                case 'i18n-sync':
                case 'i18n-s':
                    command = i18n.sync;
                    break;
                case 'i18n-set':
                    command = i18n.set;
                    break;
                case 'i18n-remove':
                case 'i18n-rm':
                    command = i18n.remove;
                    break;
                case 'temp':
                    command = temp;
                    break;
                default:
                    logger.fatal(`command '${arg}' not found`);
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

try {
    command(args);
} catch (e) {
    logger.fatal(e);
}

function temp() {
    logger.fatal(`command not realised`);
}

function migrate() {
    const fs = require('fs');
    const itemsTools = require('./items');
    const items = require('./../src/data/items.json');

    let output = {}, uid, assoc = {getNew: {}, getOld: {},}, i18n, i18nNew;

    Object.values(items).map(item => {
        uid = itemsTools.makeUid(item.type, item.name, item.hero);
        assoc.getNew[item.uid] = uid;
        assoc.getOld[uid] = item.uid;

        if (['SPRAY', 'ICON',].indexOf(item.type) !== -1) {
            fs.renameSync(
                `./../src/assets/${item.type.toLowerCase()}s/${item.uid}.png`,
                `./../src/assets/${item.type.toLowerCase()}s/${uid}.png`
            );
        }

        item.uid = uid;
        output[item.uid] = item;
    });

    fs.readdirSync('./../src/i18n/').map(file => {
        if (file.indexOf('.json') !== -1) {
            i18nNew = {};
            i18n = require(`./../src/i18n/${file}`);
            for (let i in i18n.items) if (i18n.items.hasOwnProperty(i)) {
                i18nNew[assoc.getNew[i]] = i18n.items[i];
            }
            i18n.items = i18nNew;
            fs.writeFileSync(`./../src/i18n/${file}`, JSON.stringify(i18n, null, 2));
        }
    });

    fs.writeFileSync('./../src/data/assoc.json', JSON.stringify(assoc, null, 2));
    fs.writeFileSync('./../src/data/items.json', JSON.stringify(output, null, 2));
}

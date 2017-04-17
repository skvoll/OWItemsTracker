"use strict";

const fs = require('fs');
const logger = require('./logger');

let items = require('./../src/data/items.json');

function sort(object) {
    let keys = Object.keys(object), result = {};

    keys.sort((a, b) => {
        if (a === b) {
            return 0;
        }

        return a > b ? 1 : -1;
    });

    keys.map((key) => {
        result[key] = object[key];
    });

    return result;
}

const i18nCreate = function (args = {}) {
    if (!args['l'] || typeof args['l'] !== 'string') {
        logger.fatal('language is missing');
    }

    let i18n = {
        items: `./../src/i18n/${args['l']}.items.json`,
    }, count = 0;

    if (!fs.existsSync(i18n.items)) {
        logger.warn(`'${i18n.items}' does not exists and will be created`);

        i18n.items = {};
    } else {
        i18n.items = require(i18n.items);
    }

    Object.values(items).map((item) => {
        if (!i18n.items[item.uid]) {
            count++;

            i18n.items[item.uid] = item.name;
        }
    });

    if (count === 0) {
        logger.info('nothing to update');
    } else {
        fs.writeFileSync(`./../src/i18n/${args['l']}.items.json`, JSON.stringify(i18n.items, null, 2));

        logger.success(`${count} translation(s) added`);
    }
};

const i18nExport = function (args = {}) {
    if (!args['l'] || typeof args['l'] !== 'string') {
        logger.fatal('language is missing');
    }

    let i18n = {
        items: `./../src/i18n/${args['l']}.items.json`,
        events: `./../src/i18n/${args['l']}.events.json`,
        heroes: `./../src/i18n/${args['l']}.heroes.json`,
        interface: `./../src/i18n/${args['l']}.interface.json`,
    }, template = `INFORMATION;TRANSLATION;KEY\n`, tsv = {
        items: template,
        events: template,
        heroes: template,
        interface: template,
    };

    for (let i in i18n) if (i18n.hasOwnProperty(i)) {
        if (!fs.existsSync(i18n[i])) {
            logger.fatal(`'${i18n[i]}' does not exists`);
        }

        i18n[i] = require(i18n[i]);

        if (i === 'items') {
            Object.values(items).map((item) => {
                tsv[i] += [
                        `${(item.hero ? `${item.hero} ` : '')}${item.type} ${item.name}`,
                        `${i18n[i][item.uid]}`,
                        `${item.uid}`,
                    ].join('\t') + '\n';
            });
        } else {
            Object.keys(i18n[i]).map((key) => {
                tsv[i] += [
                        'INFORMATION',
                        i18n[i][key].replace(/(\n)+/g, ' '),
                        key,
                    ].join('\t') + '\n';
            });
        }

        fs.writeFileSync(`./${args['l']}.${i}.tsv`, tsv[i]);

        logger.success(`'./${args['l']}.${i}.tsv' created`);
    }
};

const i18nImport = function (args = {}) {
    if (!args['t'] || typeof args['t'] !== 'string') {
        logger.fatal('type is missing');
    }

    if (!args['l'] || typeof args['l'] !== 'string') {
        logger.fatal('language is missing');
    }

    if (!args['f'] || typeof args['f'] !== 'string') {
        logger.fatal('tsv file is missing');
    }

    if (!fs.existsSync(args['f'])) {
        logger.fatal(`'${args['f']}' does not exists`);
    }

    let savePath, i18n = {
        items: `./../src/i18n/${args['l']}.items.json`,
        events: `./../src/i18n/${args['l']}.events.json`,
        heroes: `./../src/i18n/${args['l']}.heroes.json`,
        interface: `./../src/i18n/${args['l']}.interface.json`,
    }, addedCount = 0, updatedCount = 0;

    if (Object.keys(i18n).indexOf(args['t']) === -1) {
        logger.fatal(`wrong type '${args['t']}'. should be one of [${Object.keys(i18n).join(', ')}]`);
    }

    savePath = i18n[args['t']];

    if (!fs.existsSync(i18n[args['t']])) {
        logger.warn(`'${i18n[args['t']]}' does not exists and will be created`);

        i18n[args['t']] = {};
    } else {
        i18n[args['t']] = require(i18n[args['t']]);
    }

    fs.readFileSync(args['f'], 'utf-8').split('\n').map((line, index) => {
        if (index === 0) {
            return;
        }

        line = line.split('\t');

        if (line.length < 3) {
            return;
        }

        line[2] = line[2].replace('\r', '');

        if (!i18n[args['t']][line[2]]) {
            addedCount++;

            i18n[args['t']][line[2]] = line[1];
        } else if (i18n[args['t']][line[2]] !== line[1]) {
            updatedCount++;

            i18n[args['t']][line[2]] = line[1];
        }
    });

    if (addedCount === 0 && updatedCount === 0) {
        logger.info('nothing to update');
    } else {
        if (['interface', 'heroes',].indexOf(args['t']) !== -1) {
            i18n[args['t']] = sort(i18n[args['t']]);
        }

        fs.writeFileSync(savePath, JSON.stringify(i18n[args['t']], null, 2));

        if (addedCount) {
            logger.success(`${addedCount} item(s) added`);
        }

        if (updatedCount) {
            logger.success(`${updatedCount} item(s) updated`);
        }
    }
};

module.exports = {
    create: i18nCreate,
    export: i18nExport,
    import: i18nImport,
};

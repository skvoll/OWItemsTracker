"use strict";

const fs = require('fs');
const logger = require('./logger');

let items = require('./../src/data/items.json');

const l10nCreate = function (args = {}) {
    if (!args['l'] || typeof args['l'] !== 'string') {
        logger.fatal('language is missing');
    }

    let l10n = {
        items: `./../src/translations/${args['l']}.items.json`,
    }, count = 0;

    if (!fs.existsSync(l10n.items)) {
        logger.warn(`'${l10n.items}' does not exists and will be created`);

        l10n.items = {};
    } else {
        l10n.items = require(l10n.items);
    }

    Object.values(items).map((item) => {
        if (!l10n.items[item.uid]) {
            count++;

            l10n.items[item.uid] = item.name;
        }
    });

    if (count === 0) {
        logger.info('nothing to update');
    } else {
        fs.writeFileSync(`./../src/translations/${args['l']}.items.json`, JSON.stringify(l10n.items, null, 2));

        logger.success(`${count} translation(s) added`);
    }
};

const l10nExport = function (args = {}) {
    if (!args['l'] || typeof args['l'] !== 'string') {
        logger.fatal('language is missing');
    }

    let l10n = {
        general: `./../src/translations/${args['l']}.json`,
        items: `./../src/translations/${args['l']}.items.json`,
    }, csv = {
        general: `INFORMATION;TRANSLATION;KEY\n`,
        items: `INFORMATION;TRANSLATION;KEY\n`,
    };

    if (!fs.existsSync(l10n.general)) {
        logger.fatal(`'${l10n.general}' does not exists`);
    }

    if (!fs.existsSync(l10n.items)) {
        logger.fatal(`'${l10n.items}' does not exists`);
    }

    l10n.general = require(l10n.general);
    l10n.items = require(l10n.items);

    Object.keys(l10n.general).map((key) => {
        csv.general += [
                'INFORMATION',
                l10n.general[key],
                key,
            ].join(';') + '\n';
    });

    Object.values(items).map((item) => {
        csv.items += [
                `${(item.hero ? `${item.hero} ` : '')}${item.type} ${item.name}`,
                `${l10n.items[item.uid]}`,
                `${item.uid}`,
            ].join(';') + '\n';
    });

    fs.writeFileSync(`./${args['l']}.csv`, csv.general);
    fs.writeFileSync(`./${args['l']}.items.csv`, csv.items);

    logger.success(`'./${args['l']}.csv' created`);
    logger.success(`'./${args['l']}.item.csv' created`);
};

const l10nImport = function (args = {}) {
    if (!args['t'] || typeof args['t'] !== 'string') {
        logger.fatal('type is missing');
    }

    if (!args['l'] || typeof args['l'] !== 'string') {
        logger.fatal('language is missing');
    }

    if (!args['f'] || typeof args['f'] !== 'string') {
        logger.fatal('csv file is missing');
    }

    if (!fs.existsSync(args['f'])) {
        logger.fatal(`'${args['f']}' does not exists`);
    }

    let savePath, l10n = {
        general: `./../src/translations/${args['l']}.json`,
        items: `./../src/translations/${args['l']}.items.json`,
    }, addedCount = 0, updatedCount = 0;

    if (Object.keys(l10n).indexOf(args['t']) === -1) {
        logger.fatal(`wrong type '${args['t']}'. should be one of [${Object.keys(l10n).join(', ')}]`);
    }

    savePath = l10n[args['t']];

    if (!fs.existsSync(l10n[args['t']])) {
        logger.warn(`'${l10n[args['t']]}' does not exists and will be created`);

        l10n[args['t']] = {};
    } else {
        l10n[args['t']] = require(l10n[args['t']]);
    }

    fs.readFileSync(args['f'], 'utf-8').split('\n').map((line, index) => {
        if (index === 0) {
            return;
        }

        line = line.split(';');

        if (line.length < 3) {
            return;
        }

        if (!l10n[args['t']][line[2]]) {
            addedCount++;

            l10n[args['t']][line[2]] = line[1];
        } else if (l10n[args['t']][line[2]] !== line[1]) {
            updatedCount++;

            l10n[args['t']][line[2]] = line[1];
        }
    });

    if (addedCount === 0 && updatedCount === 0) {
        logger.info('nothing to update');
    } else {
        fs.writeFileSync(savePath, JSON.stringify(l10n[args['t']], null, 2));

        if (addedCount) {
            logger.success(`${addedCount} item(s) added`);
        }

        if (updatedCount) {
            logger.success(`${updatedCount} item(s) updated`);
        }
    }
};

module.exports = {
    create: l10nCreate,
    export: l10nExport,
    import: l10nImport,
};

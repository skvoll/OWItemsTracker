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

const l10nCreate = function (args = {}) {
    if (!args['l'] || typeof args['l'] !== 'string') {
        logger.fatal('language is missing');
    }

    let l10n = {
        items: `./../src/l10n/${args['l']}.items.json`,
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
        fs.writeFileSync(`./../src/l10n/${args['l']}.items.json`, JSON.stringify(l10n.items, null, 2));

        logger.success(`${count} translation(s) added`);
    }
};

const l10nExport = function (args = {}) {
    if (!args['l'] || typeof args['l'] !== 'string') {
        logger.fatal('language is missing');
    }

    let l10n = {
        items: `./../src/l10n/${args['l']}.items.json`,
        events: `./../src/l10n/${args['l']}.events.json`,
        heroes: `./../src/l10n/${args['l']}.heroes.json`,
        interface: `./../src/l10n/${args['l']}.interface.json`,
    }, template = `INFORMATION;TRANSLATION;KEY\n`, csv = {
        items: template,
        events: template,
        heroes: template,
        interface: template,
    };

    for (let i in l10n) if (l10n.hasOwnProperty(i)) {
        if (!fs.existsSync(l10n[i])) {
            logger.fatal(`'${l10n[i]}' does not exists`);
        }

        l10n[i] = require(l10n[i]);

        if (i === 'items') {
            Object.values(items).map((item) => {
                csv[i] += [
                        `${(item.hero ? `${item.hero} ` : '')}${item.type} ${item.name}`,
                        `${l10n[i][item.uid]}`,
                        `${item.uid}`,
                    ].join('\t') + '\n';
            });
        } else {
            Object.keys(l10n[i]).map((key) => {
                csv[i] += [
                        'INFORMATION',
                        l10n[i][key].replace(/(\n)+/g, ' '),
                        key,
                    ].join('\t') + '\n';
            });
        }

        fs.writeFileSync(`./${args['l']}.${i}.csv`, csv[i]);

        logger.success(`'./${args['l']}.${i}.csv' created`);
    }
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
        items: `./../src/l10n/${args['l']}.items.json`,
        events: `./../src/l10n/${args['l']}.events.json`,
        heroes: `./../src/l10n/${args['l']}.heroes.json`,
        interface: `./../src/l10n/${args['l']}.interface.json`,
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

        line = line.split('\t');

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
        if (['interface', 'heroes',].indexOf(args['t']) !== -1) {
            l10n[args['t']] = sort(l10n[args['t']]);
        }

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

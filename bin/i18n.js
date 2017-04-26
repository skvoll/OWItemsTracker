"use strict";

const fs = require('fs');
const logger = require('./logger');
const google = require('./google');

let items = require('./../src/data/items.json');

function sort(object) {
    let keys = Object.keys(object), result = {};

    keys.sort((a, b) => {
        if (a === b) {
            return 0;
        }

        return a > b ? 1 : -1;
    });

    keys.map(key => {
        result[key] = object[key];
    });

    return result;
}

const i18nExport = function (args = {}) {
    if (!args['l'] || typeof args['l'] !== 'string') {
        logger.fatal('language is missing');
    }

    let i18n = `./../src/i18n/${args['l']}.json`,
        template = `INFORMATION\tTRANSLATION\tKEY\n`,
        tsv = {
            items: template,
            events: template,
            heroes: template,
            interface: template,
        };

    if (!fs.existsSync(i18n)) {
        logger.fatal(`'${i18n}' does not exists`);
    }

    i18n = require(i18n);

    for (let i in i18n) if (i18n.hasOwnProperty(i)) {
        if (i === 'items') {
            Object.values(items).map(item => {
                tsv[i] += [
                        `${(item.hero ? `${item.hero} ` : '')}${item.type} ${item.name}`,
                        `${i18n[i][item.uid]}`,
                        `${item.uid}`,
                    ].join('\t') + '\n';
            });
        } else {
            Object.keys(i18n[i]).map(key => {
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

    let path = `./../src/i18n/${args['l']}.json`,
        i18n,
        addedCount = 0,
        updatedCount = 0;

    if (!fs.existsSync(path)) {
        logger.warn(`'${path}' does not exists and will be created`);

        i18n = {};
    } else {
        i18n = require(path);
    }

    fs.readFileSync(args['f'], 'utf-8').split('\n').map((line, index) => {
        if (index === 0) {
            return;
        }

        if (!i18n.hasOwnProperty(args['t'])) {
            i18n[args['t']] = {};
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

        fs.writeFileSync(path, JSON.stringify(i18n, null, 2));

        if (addedCount) {
            logger.success(`${addedCount} item(s) added`);
        }

        if (updatedCount) {
            logger.success(`${updatedCount} item(s) updated`);
        }
    }
};

const i18nSync = function (args = {}) {
    let path, i18n;

    google.getTranslations().then(translations => {
        for (let i in translations) if (translations.hasOwnProperty(i)) {
            path = `./../src/i18n/${i}.json`;

            if (fs.existsSync(path)) {
                i18n = require(path);
            } else {
                i18n = null;
                logger.warn(`'${path}' does not exists and will be created`);
            }

            for (let j in translations[i]) if (translations[i].hasOwnProperty(j)) {
                for (let k in translations[i][j]) if (translations[i][j].hasOwnProperty(k)) {
                    if (i18n) {
                        if (!i18n[j][k]) {
                            logger.info(`${i} ${j}: '${k}'='${translations[i][j][k]}' added`);
                        } else if (i18n[j][k] !== translations[i][j][k]) {
                            logger.info(`${i} ${j}: '${k}'='${i18n[j][k]}' changed to '${translations[i][j][k]}'`);
                        }
                    }
                }

                if (['interface', 'heroes',].indexOf(j.toLowerCase()) !== -1) {
                    translations[i][j] = sort(translations[i][j]);
                }
            }

            fs.writeFileSync(
                path,
                JSON.stringify(translations[i], null, 2)
            );

            logger.success(`${i} synchronized`);
        }
    }).catch(logger.fatal);
};

const i18nSet = function (args = {}) {
    if (!args['k'] || typeof args['k'] !== 'string') {
        logger.fatal('key is missing');
    }

    if (!args['v'] || typeof args['v'] !== 'string') {
        logger.fatal('value is missing');
    }

    let i18n;

    fs.readdirSync(`./../src/i18n/`).map(file => {
        if (file.match(/[a-z]{2}_[A-Z]{2}\.json/)) {
            i18n = require(`./../src/i18n/${file}`);

            if (!i18n.hasOwnProperty('interface')) {
                i18n.interface = {};
            }

            i18n.interface[args['k']] = args['v'];

            i18n.interface = sort(i18n.interface);

            fs.writeFileSync(`./../src/i18n/${file}`, JSON.stringify(i18n, null, 2));
        }
    });

    logger.success(`${args['k']} setted to "${args['v']}"`);
};

const i18nRemove = function (args = {}) {
    if (!args['k'] || typeof args['k'] !== 'string') {
        logger.fatal('key is missing');
    }

    let i18n;

    fs.readdirSync(`./../src/i18n/`).map(file => {
        if (file.match(/[a-z]{2}_[A-Z]{2}\.json/)) {
            i18n = require(`./../src/i18n/${file}`);
            if (!i18n.hasOwnProperty('interface') || !i18n.interface[args['k']]) {
                logger.warn(`${args['k']} not found in '${file}'`);
            }

            delete i18n.interface[args['k']];

            i18n.interface = sort(i18n.interface);

            fs.writeFileSync(`./../src/i18n/${file}`, JSON.stringify(i18n, null, 2));
        }
    });

    logger.success(`${args['k']} deleted`);
};

module.exports = {
    export: i18nExport,
    import: i18nImport,
    sync: i18nSync,
    set: i18nSet,
    remove: i18nRemove,
};

#!/usr/bin/env node

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
                case 'i18n-create':
                case 'i18n-c':
                    command = i18n.create;
                    break;
                case 'i18n-export':
                case 'i18n-e':
                    command = i18n.export;
                    break;
                case 'i18n-import':
                case 'i18n-i':
                    command = i18n.import;
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

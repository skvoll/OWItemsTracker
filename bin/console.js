#!/usr/bin/env node

"use strict";

const logger = require('./logger');
const application = require('./application');
const items = require('./items');
const l10n = require('./l10n');

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
                case 'l10n-create':
                case 'l10n-c':
                    command = l10n.create;
                    break;
                case 'l10n-export':
                case 'l10n-e':
                    command = l10n.export;
                    break;
                case 'l10n-import':
                case 'l10n-i':
                    command = l10n.import;
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

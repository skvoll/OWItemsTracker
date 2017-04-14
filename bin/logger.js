"use strict";

require('colors');
const moment = require('moment');

const fatal = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`FATAL [${moment().format('HH:mm:ss')}]: ${message}`.bgRed);

    process.exit();
};

const error = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`ERROR [${moment().format('HH:mm:ss')}]: ${message}`.red);
};

const warn = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`WARN [${moment().format('HH:mm:ss')}]: ${message}`.yellow);
};

const info = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`INFO [${moment().format('HH:mm:ss')}]: ${message}`.cyan);
};

const success = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`SUCCESS [${moment().format('HH:mm:ss')}]: ${message}`.green);
};

const failed = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`FAILED [${moment().format('HH:mm:ss')}]: ${message}`.red);
};

const log = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`LOG [${moment().format('HH:mm:ss')}]: ${message}`);
};

module.exports = {
    fatal: fatal,
    error: error,
    warn: warn,
    info: info,
    success: success,
    failed: failed,
    log: log,
};

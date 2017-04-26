"use strict";

const readline = require('readline');
require('colors');
const moment = require('moment');

const fatal = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`[${moment().format('HH:mm:ss')}] FATAL: ${message}`.bgRed);

    process.exit();
};

const error = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`[${moment().format('HH:mm:ss')}] ERROR: ${message}`.red);
};

const warn = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`[${moment().format('HH:mm:ss')}] WARN: ${message}`.yellow);
};

const info = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`[${moment().format('HH:mm:ss')}] INFO: ${message}`.cyan);
};

const success = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`[${moment().format('HH:mm:ss')}] SUCCESS: ${message}`.green);
};

const failed = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`[${moment().format('HH:mm:ss')}] FAILED: ${message}`.red);
};

const log = function () {
    let message = Object.values(arguments).join(', ');

    console.log(`[${moment().format('HH:mm:ss')}] LOG: ${message}`);
};

const question = function (question, answers = []) {
    return new Promise((resolve, reject) => {
        let rl = readline.createInterface({
            input: process.stdin,
            output: process.output,
        });

        if (answers.length) {
            question += ` [${answers.join('/')}]`;
        }

        process.stdout.write(`${question}: `.cyan);

        rl.on('line', answer => {
            if (answers.length && answers.indexOf(answer) === -1) {
                process.stdout.write(`${question}: `.cyan);

                return;
            }

            resolve(answer);

            rl.close();
        });
    });
};

module.exports = {
    fatal: fatal,
    error: error,
    warn: warn,
    info: info,
    success: success,
    failed: failed,
    log: log,
    question: question,
};

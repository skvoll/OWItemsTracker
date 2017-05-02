"use strict";

const logger = require('./logger');

let uid = function (args = {}, showResult = true) {
    let uid = [];

    if (args['p']) {
        uid = Array.isArray(args['p']) ? args['p'] : [args['p']];
    }

    if (!args['s']) {
        logger.fatal('string is missing');
    }

    args['s'].toUpperCase().split('').map(c => uid.push(c.charCodeAt(0)));

    uid = uid.join('-');

    if (showResult) {
        logger.log(uid);
    }

    return uid;
};

let uidDecode = function (args = {}, showResult = true) {
    let string, prefix = [], chars = [];

    if (!args['u']) {
        logger.fatal('uid is missing');
    }

    args['u'] = args['u'].split('-');

    args['u'].map((char, index) => {
        if (
            (index === 0)
            || (index === 1 && !parseInt(char))
        ) {
            prefix.push(char);

            return;
        }

        chars.push(String.fromCharCode(char));
    });

    string = prefix.join(' ') + ' ' + chars.join('');

    if (showResult) {
        logger.log(string);
    }

    return string;
};

module.exports = {
    uid: uid,
    uidDecode: uidDecode,
};

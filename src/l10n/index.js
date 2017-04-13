"use strict";

import CONFIG from '../config';

export const LANGUAGES = {
    en_US: {
        name: 'english',
        translations: Object.assign(
            require('./en_US.json'),
            require('./en_US.items.json')
        ),
    },
    ru_RU: {
        name: 'русский',
        translations: Object.assign(
            require('./ru_RU.json'),
            require('./ru_RU.items.json')
        ),
    },
};

export default function (key, defaultReturn = null) {
    if (defaultReturn === null) {
        defaultReturn = `_${key}_`
    }

    if (!LANGUAGES[CONFIG.LANGUAGE]) {
        return LANGUAGES.en_US.translations[key] || defaultReturn;
    }

    return LANGUAGES[CONFIG.LANGUAGE].translations[key] || defaultReturn;
};

"use strict";

import CONFIG from './config';

export const LANGUAGES = {
    en: {
        name: 'english',
        translations: Object.assign(
            require('./translations/en.json'),
            require('./translations/en.items.json')
        ),
    },
    ru: {
        name: 'русский',
        translations: Object.assign(
            require('./translations/ru.json'),
            require('./translations/ru.items.json')
        ),
    },
};

export default function (key, defaultReturn = null) {
    if (defaultReturn === null) {
        defaultReturn = `_${key}_`
    }

    if (!LANGUAGES[CONFIG.LANGUAGE]) {
        return LANGUAGES.en.translations[key] || defaultReturn;
    }

    return LANGUAGES[CONFIG.LANGUAGE].translations[key] || defaultReturn;
};

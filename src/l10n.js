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

export default function (key) {
    if (!LANGUAGES[CONFIG.LANGUAGE]) {
        return `_${key}_`;
    }

    return LANGUAGES[CONFIG.LANGUAGE].translations[key] || `_${key}_`;
};

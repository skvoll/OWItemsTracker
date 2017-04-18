"use strict";

import CONFIG from './../config';

export const LANGUAGES = {
    en_US: {
        name: 'english',
        translators: [
            // {name: '', icon: '', link: '',},
        ],
        translations: Object.assign(
            {},
            require('./en_US.items.json'),
            require('./en_US.events.json'),
            require('./en_US.heroes.json'),
            require('./en_US.interface.json')
        ),
    },
    ru_RU: {
        name: 'русский',
        translators: [
            {name: '/u/FixKun', icon: 'reddit-alien', link: 'https://www.reddit.com/user/FixKun',},
            {name: 'BurzZzum', icon: 'twitter', link: 'https://twitter.com/BurzZzum',},
        ],
        translations: Object.assign(
            {},
            require('./ru_RU.items.json'),
            require('./ru_RU.events.json'),
            require('./ru_RU.heroes.json'),
            require('./ru_RU.interface.json')
        ),
    },
    hu_HU: {
        name: 'magyar',
        translators: [
            {name: '/u/skagx', icon: 'reddit-alien', link: 'https://www.reddit.com/user/skagx',},
        ],
        translations: Object.assign(
            {},
            require('./en_US.items.json'),
            require('./en_US.events.json'),
            require('./en_US.heroes.json'),
            require('./hu_HU.interface.json')
        ),
    },
};

export default function (key, defaultReturn = null) {
    if (defaultReturn === null) {
        defaultReturn = `_${key}_`;
    }

    if (!LANGUAGES[CONFIG.LANGUAGE]) {
        return LANGUAGES.en_US.translations[key] || defaultReturn;
    }

    return LANGUAGES[CONFIG.LANGUAGE].translations[key] || defaultReturn;
};

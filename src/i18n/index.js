"use strict";

import CONFIG from './../config';

export const LANGUAGES = {
    en_US: {
        name: 'english',
        translators: [
            // {name: '', icon: '', link: '',},
        ],
        translations: Object.assign(...Object.values(require('./en_US.json'))),
    },
    de_DE: {
        name: 'deutsch',
        translators: [
            {name: '/u/veggie_gamer', icon: 'reddit-alien', link: 'https://www.reddit.com/user/veggie_gamer',},
        ],
        translations: Object.assign(...Object.values(require('./de_DE.json'))),
    },
    es_ES: {
        name: 'español',
        translators: [
            {name: '/u/Zasd_Bros', icon: 'reddit-alien', link: 'https://www.reddit.com/user/Zasd_Bros',},
        ],
        translations: Object.assign(...Object.values(require('./es_ES.json'))),
    },
    es_MX: {
        name: 'español (al)',
        translators: [
            {name: '/u/70006', icon: 'reddit-alien', link: 'https://www.reddit.com/user/70006',},
        ],
        translations: Object.assign(...Object.values(require('./es_MX.json'))),
    },
    hu_HU: {
        name: 'magyar',
        translators: [
            {name: '/u/skagx', icon: 'reddit-alien', link: 'https://www.reddit.com/user/skagx',},
        ],
        translations: Object.assign(...Object.values(require('./hu_HU.json'))),
    },
    pl_PL: {
        name: 'polski',
        translators: [
            {name: 'MichGrabowski', icon: 'twitter', link: 'https://twitter.com/MichGrabowski',},
        ],
        translations: Object.assign(...Object.values(require('./pl_PL.json'))),
    },
    pt_BR: {
        name: 'português (brasileiro)',
        translators: [
            {name: '/u/tpl1997', icon: 'reddit-alien', link: 'https://www.reddit.com/user/tpl1997',},
        ],
        translations: Object.assign(...Object.values(require('./pt_BR.json'))),
    },
    ru_RU: {
        name: 'русский',
        translators: [
            {name: '/u/FixKun', icon: 'reddit-alien', link: 'https://www.reddit.com/user/FixKun',},
            {name: 'BurzZzum', icon: 'twitter', link: 'https://twitter.com/BurzZzum',},
        ],
        translations: Object.assign(...Object.values(require('./ru_RU.json'))),
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

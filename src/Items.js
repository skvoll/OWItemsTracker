"use strict";

import {
    AsyncStorage,
    ToastAndroid,
} from 'react-native';

import CONFIG from './config';
import _ from './l10n';
import CloudStorage from './CloudStorage';
import Events from './Events';
import Heroes from './Heroes';

export default class Items {
    static isInitialized = false;
    static timeout;

    static DATA;
    static CACHE = {};
    static RECEIVED_ITEMS = [];

    static TYPE = {
        SKIN: 1,
        EMOTE: 2,
        VICTORY_POSE: 3,
        VOICE_LINE: 4,
        SPRAY: 5,
        HIGHLIGHT_INTRO: 6,
        WEAPON: 7,
        ICON: 8,
    };

    static RARITY = {
        COMMON: 1,
        RARE: 2,
        EPIC: 3,
        LEGENDARY: 4,
    };

    static COLOR = {
        [Items.RARITY.COMMON]: CONFIG.COLORS.COMMON,
        [Items.RARITY.RARE]: CONFIG.COLORS.RARE,
        [Items.RARITY.EPIC]: CONFIG.COLORS.EPIC,
        [Items.RARITY.LEGENDARY]: CONFIG.COLORS.LEGENDARY,
    };

    static PRICE = {
        DEFAULT: {
            [Items.RARITY.COMMON]: 25,
            [Items.RARITY.RARE]: 75,
            [Items.RARITY.EPIC]: 250,
            [Items.RARITY.LEGENDARY]: 1000,
        },
        EVENT: {
            [Items.RARITY.COMMON]: 75,
            [Items.RARITY.RARE]: 225,
            [Items.RARITY.EPIC]: 750,
            [Items.RARITY.LEGENDARY]: 3000,
        },
    };

    static async initialize() {
        this.isInitialized = true;

        try {
            await CloudStorage.authorize();

            let LOCAL_RECEIVED_ITEMS_DATE = JSON.parse(await AsyncStorage.getItem('RECEIVED_ITEMS_DATE')) || null;
            let CLOUD_RECEIVED_ITEMS_DATE = parseInt(await CloudStorage.get('items/date')) || null;

            if (CLOUD_RECEIVED_ITEMS_DATE && CLOUD_RECEIVED_ITEMS_DATE > LOCAL_RECEIVED_ITEMS_DATE) {
                this.RECEIVED_ITEMS = await CloudStorage.get('items/received_items') || [];
            } else {
                this.RECEIVED_ITEMS = JSON.parse(await AsyncStorage.getItem('RECEIVED_ITEMS')) || [];
            }
        } catch (error) {
            ToastAndroid.show(_('ERROR__CLOUD_SYNCHRONIZATION_FAILED'), ToastAndroid.SHORT);

            this.RECEIVED_ITEMS = JSON.parse(await AsyncStorage.getItem('RECEIVED_ITEMS')) || [];
        }

        this.save();
    }

    static select(uid = null, type = null, rarity = null, hero = null, event = null) {
        let items, key = `${uid}_${type}_${rarity}_${hero}_${event}`;

        if (!this.CACHE[key]) {
            this.CACHE[key] = [];

            for (let item of Object.values(this.DATA)) {
                if (uid !== null && item.uid === uid) {
                    return item;
                }

                switch (true) {
                    case (uid !== null && item.uid === uid):
                        return item;
                        break;
                    case (type !== null && type !== item.type):
                    case (rarity !== null && rarity !== item.rarity):
                    case (hero !== null && hero !== item.hero):
                    case (event !== null && event !== item.event):
                        continue;
                        break;
                    default:
                        this.CACHE[key].push(item);
                        break;
                }
            }
        }

        items = this.CACHE[key];

        items.map((item) => {
            item.received = this.RECEIVED_ITEMS.indexOf(item.uid) !== -1;
        });

        return items;
    }

    static save() {
        let date = CONFIG.CLOUD_SYNCHRONIZATION ? (new Date() / 1000).toFixed(0) : 0;

        return AsyncStorage.setItem('RECEIVED_ITEMS', JSON.stringify(this.RECEIVED_ITEMS)).then(() => {
            AsyncStorage.setItem('RECEIVED_ITEMS_DATE', JSON.stringify(date)).then(() => {
                if (date) {
                    CloudStorage.save('items/date', date);
                    CloudStorage.save('items/received_items', this.RECEIVED_ITEMS);
                }
            });
        });
    }

    static receiveItem(code, received) {
        let index = this.RECEIVED_ITEMS.indexOf(code);

        if (received) {
            if (!this.DATA[code] || index !== -1) {
                return;
            }

            this.RECEIVED_ITEMS.push(code);
        } else {
            if (index === -1) {
                return;
            }

            this.RECEIVED_ITEMS.splice(index, 1);
        }

        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => this.save(), 500);
    }

    static clear() {
        return AsyncStorage.setItem('RECEIVED_ITEMS', '[]').then(() => {
            this.RECEIVED_ITEMS = [];

            this.save();
        });
    }

    static getProgressByEvents() {
        let progress = {};

        Object.keys(Events.ITEMS).map((event) => {
            progress[event] = {received: 0, total: 0,};
        });

        this.select().map((item) => {
            if (item.event === false) {
                return;
            }

            if (item.default) {
                return;
            }

            progress[item.event].total++;
            if (item.received || item.default) {
                progress[item.event].received++;
            }
        });

        return progress;
    }

    static getProgressByType(event = null) {
        let progress = {};

        this.select(null, null, null, null, event).map((item) => {
            if (!progress[item.type]) {
                progress[item.type] = {received: 0, total: 0,};
            }

            if (item.default) {
                return;
            }

            progress[item.type].total++;
            if (item.received || item.default) {
                progress[item.type].received++;
            }
        });

        return progress;
    }

    static getProgressByHeroes(event = null) {
        let hero, progress = {};

        this.select(null, null, null, null, event).map((item) => {
            hero = item.hero || 0;

            if (!CONFIG.INCLUDE_ICONS_IN_PROGRESS) {
                if (item.type === this.TYPE.ICON) {
                    return;
                }
            }

            if (event === false && !CONFIG.INCLUDE_SPECIALS_IN_PROGRESS) {
                if (item.event === Events.SPECIAL && item.hero !== Heroes.GENJI) {
                    return;
                }
            }

            if (!progress[hero]) {
                progress[hero] = {received: 0, total: 0,};
            }

            if (item.default) {
                return;
            }

            progress[hero].total++;
            if (item.received || item.default) {
                progress[hero].received++;
            }
        });

        return progress;
    }
}

if (!Items.isInitialized) {
    Items.DATA = require('./data/items').default;
}

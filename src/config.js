"use strict";

import {
    NetInfo,
    AsyncStorage,
    NativeModules,
    Platform,
} from 'react-native';
import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/en-gb';

const COLORS = {
    LIGHT_GRAY: 'rgba(225, 225, 229, 1)', // #E1E1E5
    WHITE_OPACITY: 'rgba(255, 255, 255, 0.3)', // #FFFFFF
    DARK_BLUE: 'rgba(39, 52, 77, 1)', // #27344D
    DARK_BLUE_OPACITY: 'rgba(39, 52, 77, 0.8)', // #27344D
    LIGHT_BLUE: 'rgba(28, 117, 187, 1)', // #1C75BB
    LIGHT_BLUE_OPACITY: 'rgba(28, 117, 187, 0.8)', // #1C75BB
    GRAY_BLUE: 'rgba(44, 59, 87, 1)', // #2C3B57
    GRAY_BLUE_OPACITY: 'rgba(44, 59, 87, 0.8)', // #2C3B57
    GREEN: 'rgba(55, 224, 60, 1)', // #37E03C
    RED: 'rgba(173, 31, 4, 1)', // #AD1F04

    COLOR_1: 'rgba(2, 255, 255, 1)', // #02FFFF
    COLOR_2: 'rgba(39, 170, 224, 1)', // #27AAE0

    COMMON: 'rgba(255, 255, 255, 1)', // #FFFFFF
    RARE: 'rgba(0, 195, 255, 1)', // #00C3FF
    EPIC: 'rgba(255, 0, 255, 1)', // #FF00FF
    LEGENDARY: 'rgba(255, 165, 0, 1)', // #FFA500
};

export default class CONFIG {
    static isInitialized = false;

    static VERSION = '1.0.6';
    static PLATFORM = Platform.OS;
    static PLATFORM_VERSION = Platform.Version;
    static LOCALE = 'en_US';
    static NETWORK = 'NONE';
    static COLORS = COLORS;

    static GOOGLE_SIGNIN = {
        iosClientId: '169768766629-j17q14r8li5aaeuj6md18ocgobaj2odt.apps.googleusercontent.com',
        webClientId: '169768766629-0voj800tiklb6b8in14aene8iqf3816i.apps.googleusercontent.com',
    };
    static FIREBASE = {
        apiKey: 'AIzaSyDjTD_u1wTIE74hc11-slqQy_tihPLGm1g',
        databaseURL: 'https://ow-items-tracker-ce744.firebaseio.com/',
        storageBucket: 'ow-items-tracker-ce744.appspot.com',
    };

    static SHOW_NEWS = false;

    static LANGUAGE = 'en_US';
    static INCLUDE_ICONS_IN_PROGRESS = false;
    static CLOUD_SYNCHRONIZATION = false;
    static PROFILE = null;

    static async initialize() {
        if (this.isInitialized) {
            return;
        }

        this.isInitialized = true;

        this.NETWORK = await NetInfo.fetch();

        NetInfo.addEventListener('change', (network) => this.NETWORK = network);

        let config = JSON.parse(await AsyncStorage.getItem('CONFIG'));

        if (config && typeof config === 'object') {
            for (let i in config) if (config.hasOwnProperty(i)) {
                CONFIG[i] = config[i];
            }
        }
    }

    static async set(key, value) {
        let config = await AsyncStorage.getItem('CONFIG');

        config = JSON.parse(config);

        if (typeof key === 'object') {
            if (config) {
                config = Object.assign(config, key);
            } else {
                config = key;
            }

            for (let i in config) if (config.hasOwnProperty(i)) {
                this[i] = config[i];
            }
        } else if (config) {
            config[key] = value;
        } else {
            config = {
                [key]: value,
            };
        }

        this[key] = value;

        return AsyncStorage.setItem('CONFIG', JSON.stringify(config));
    }

    static async remove(key) {
        if (typeof key === 'object') {
            let config = {};

            key.map((k) => {
                config[k] = null;
            });

            key = config;
        }

        return this.set(key, null);
    }
}

if (CONFIG.PLATFORM === 'android') {
    CONFIG.LANGUAGE = CONFIG.LOCALE = NativeModules.I18nManager.localeIdentifier;
} else if (CONFIG.PLATFORM === 'ios') {
    CONFIG.LANGUAGE = CONFIG.LOCALE = NativeModules.SettingsManager.settings.AppleLocale;
}

moment.locale(CONFIG.LOCALE);

"use strict";

export default class Heroes {
    static ANA = 1;
    static BASTION = 2;
    static DVA = 3;
    static GENJI = 4;
    static HANZO = 5;
    static JUNKRAT = 6;
    static LUCIO = 7;
    static MCCREE = 8;
    static MEI = 9;
    static MERCY = 10;
    static PHARAH = 11;
    static REAPER = 12;
    static REINHARDT = 13;
    static ROADHOG = 14;
    static SOLDIER76 = 15;
    static SOMBRA = 16;
    static SYMMETRA = 17;
    static TORBJORN = 18;
    static TRACER = 19;
    static WIDOWMAKER = 20;
    static WINSTON = 21;
    static ZARYA = 22;
    static ZENYATTA = 23;

    static ROLE = {
        DEFENSE: 1,
        OFFENSE: 2,
        SUPPORT: 3,
        TANK: 4,
    };

    static ITEMS = {
        [Heroes.ANA]: {
            id: Heroes.ANA,
            code: 'ANA',
            icon: require('./assets/heroes/ANA.icon.png'),
            portrait: require('./assets/heroes/ANA.portrait.png'),
            background: require('./assets/heroes/ANA.background.png'),
            role: Heroes.ROLE.SUPPORT,
        },
        [Heroes.BASTION]: {
            id: Heroes.BASTION,
            code: 'BASTION',
            icon: require('./assets/heroes/BASTION.icon.png'),
            portrait: require('./assets/heroes/BASTION.portrait.png'),
            background: require('./assets/heroes/BASTION.background.png'),
            role: Heroes.ROLE.DEFENSE,
        },
        [Heroes.DVA]: {
            id: Heroes.DVA,
            code: 'DVA',
            icon: require('./assets/heroes/DVA.icon.png'),
            portrait: require('./assets/heroes/DVA.portrait.png'),
            background: require('./assets/heroes/DVA.background.png'),
            role: Heroes.ROLE.TANK,
        },
        [Heroes.GENJI]: {
            id: Heroes.GENJI,
            code: 'GENJI',
            icon: require('./assets/heroes/GENJI.icon.png'),
            portrait: require('./assets/heroes/GENJI.portrait.png'),
            background: require('./assets/heroes/GENJI.background.png'),
            role: Heroes.ROLE.OFFENSE,
        },
        [Heroes.HANZO]: {
            id: Heroes.HANZO,
            code: 'HANZO',
            icon: require('./assets/heroes/HANZO.icon.png'),
            portrait: require('./assets/heroes/HANZO.portrait.png'),
            background: require('./assets/heroes/HANZO.background.png'),
            role: Heroes.ROLE.DEFENSE,
        },
        [Heroes.JUNKRAT]: {
            id: Heroes.JUNKRAT,
            code: 'JUNKRAT',
            icon: require('./assets/heroes/JUNKRAT.icon.png'),
            portrait: require('./assets/heroes/JUNKRAT.portrait.png'),
            background: require('./assets/heroes/JUNKRAT.background.png'),
            role: Heroes.ROLE.DEFENSE,
        },
        [Heroes.LUCIO]: {
            id: Heroes.LUCIO,
            code: 'LUCIO',
            icon: require('./assets/heroes/LUCIO.icon.png'),
            portrait: require('./assets/heroes/LUCIO.portrait.png'),
            background: require('./assets/heroes/LUCIO.background.png'),
            role: Heroes.ROLE.SUPPORT,
        },
        [Heroes.MCCREE]: {
            id: Heroes.MCCREE,
            code: 'MCCREE',
            icon: require('./assets/heroes/MCCREE.icon.png'),
            portrait: require('./assets/heroes/MCCREE.portrait.png'),
            background: require('./assets/heroes/MCCREE.background.png'),
            role: Heroes.ROLE.OFFENSE,
        },
        [Heroes.MEI]: {
            id: Heroes.MEI,
            code: 'MEI',
            icon: require('./assets/heroes/MEI.icon.png'),
            portrait: require('./assets/heroes/MEI.portrait.png'),
            background: require('./assets/heroes/MEI.background.png'),
            role: Heroes.ROLE.DEFENSE,
        },
        [Heroes.MERCY]: {
            id: Heroes.MERCY,
            code: 'MERCY',
            icon: require('./assets/heroes/MERCY.icon.png'),
            portrait: require('./assets/heroes/MERCY.portrait.png'),
            background: require('./assets/heroes/MERCY.background.png'),
            role: Heroes.ROLE.SUPPORT,
        },
        [Heroes.PHARAH]: {
            id: Heroes.PHARAH,
            code: 'PHARAH',
            icon: require('./assets/heroes/PHARAH.icon.png'),
            portrait: require('./assets/heroes/PHARAH.portrait.png'),
            background: require('./assets/heroes/PHARAH.background.png'),
            role: Heroes.ROLE.OFFENSE,
        },
        [Heroes.REAPER]: {
            id: Heroes.REAPER,
            code: 'REAPER',
            icon: require('./assets/heroes/REAPER.icon.png'),
            portrait: require('./assets/heroes/REAPER.portrait.png'),
            background: require('./assets/heroes/REAPER.background.png'),
            role: Heroes.ROLE.OFFENSE,
        },
        [Heroes.REINHARDT]: {
            id: Heroes.REINHARDT,
            code: 'REINHARDT',
            icon: require('./assets/heroes/REINHARDT.icon.png'),
            portrait: require('./assets/heroes/REINHARDT.portrait.png'),
            background: require('./assets/heroes/REINHARDT.background.png'),
            role: Heroes.ROLE.TANK,
        },
        [Heroes.ROADHOG]: {
            id: Heroes.ROADHOG,
            code: 'ROADHOG',
            icon: require('./assets/heroes/ROADHOG.icon.png'),
            portrait: require('./assets/heroes/ROADHOG.portrait.png'),
            background: require('./assets/heroes/ROADHOG.background.png'),
            role: Heroes.ROLE.TANK,
        },
        [Heroes.SOLDIER76]: {
            id: Heroes.SOLDIER76,
            code: 'SOLDIER76',
            icon: require('./assets/heroes/SOLDIER76.icon.png'),
            portrait: require('./assets/heroes/SOLDIER76.portrait.png'),
            background: require('./assets/heroes/SOLDIER76.background.png'),
            role: Heroes.ROLE.OFFENSE,
        },
        [Heroes.SOMBRA]: {
            id: Heroes.SOMBRA,
            code: 'SOMBRA',
            icon: require('./assets/heroes/SOMBRA.icon.png'),
            portrait: require('./assets/heroes/SOMBRA.portrait.png'),
            background: require('./assets/heroes/SOMBRA.background.png'),
            role: Heroes.ROLE.OFFENSE,
        },
        [Heroes.SYMMETRA]: {
            id: Heroes.SYMMETRA,
            code: 'SYMMETRA',
            icon: require('./assets/heroes/SYMMETRA.icon.png'),
            portrait: require('./assets/heroes/SYMMETRA.portrait.png'),
            background: require('./assets/heroes/SYMMETRA.background.png'),
            role: Heroes.ROLE.SUPPORT,
        },
        [Heroes.TORBJORN]: {
            id: Heroes.TORBJORN,
            code: 'TORBJORN',
            icon: require('./assets/heroes/TORBJORN.icon.png'),
            portrait: require('./assets/heroes/TORBJORN.portrait.png'),
            background: require('./assets/heroes/TORBJORN.background.png'),
            role: Heroes.ROLE.DEFENSE,
        },
        [Heroes.TRACER]: {
            id: Heroes.TRACER,
            code: 'TRACER',
            icon: require('./assets/heroes/TRACER.icon.png'),
            portrait: require('./assets/heroes/TRACER.portrait.png'),
            background: require('./assets/heroes/TRACER.background.png'),
            role: Heroes.ROLE.OFFENSE,
        },
        [Heroes.WIDOWMAKER]: {
            id: Heroes.WIDOWMAKER,
            code: 'WIDOWMAKER',
            icon: require('./assets/heroes/WIDOWMAKER.icon.png'),
            portrait: require('./assets/heroes/WIDOWMAKER.portrait.png'),
            background: require('./assets/heroes/WIDOWMAKER.background.png'),
            role: Heroes.ROLE.DEFENSE,
        },
        [Heroes.WINSTON]: {
            id: Heroes.WINSTON,
            code: 'WINSTON',
            icon: require('./assets/heroes/WINSTON.icon.png'),
            portrait: require('./assets/heroes/WINSTON.portrait.png'),
            background: require('./assets/heroes/WINSTON.background.png'),
            role: Heroes.ROLE.TANK,
        },
        [Heroes.ZARYA]: {
            id: Heroes.ZARYA,
            code: 'ZARYA',
            icon: require('./assets/heroes/ZARYA.icon.png'),
            portrait: require('./assets/heroes/ZARYA.portrait.png'),
            background: require('./assets/heroes/ZARYA.background.png'),
            role: Heroes.ROLE.TANK,
        },
        [Heroes.ZENYATTA]: {
            id: Heroes.ZENYATTA,
            code: 'ZENYATTA',
            icon: require('./assets/heroes/ZENYATTA.icon.png'),
            portrait: require('./assets/heroes/ZENYATTA.portrait.png'),
            background: require('./assets/heroes/ZENYATTA.background.png'),
            role: Heroes.ROLE.SUPPORT,
        },
    };

    static get(id) {
        return Heroes.ITEMS[id];
    }
}

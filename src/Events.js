"use strict";

export default class Events {
    static GENERAL = 0;
    static SPECIAL = 1;
    static SUMMER_GAMES_2016 = 2;
    static JUNKENSTEINS_REVENGE_2016 = 3;
    static WINTER_WONDERLAND_2016 = 4;
    static YEAR_OF_THE_ROOSTER_2017 = 5;

    static ITEMS = {
        [Events.GENERAL]: {
            id: Events.GENERAL,
            code: 'EVENT_GENERAL',
            icon: require('./assets/events/OVERWATCH.icon.png'),
            logo: require('./assets/logo.png'),
            background: require('./assets/background.jpg'),
        },
        [Events.SPECIAL]: {
            id: Events.SPECIAL,
            code: 'EVENT_SPECIAL',
            icon: require('./assets/events/BLIZZARD.icon.png'),
            logo: require('./assets/logo.png'),
            background: require('./assets/background.jpg'),
        },
        [Events.SUMMER_GAMES_2016]: {
            id: Events.SUMMER_GAMES_2016,
            code: 'SUMMER_GAMES_2016',
            icon: require('./assets/events/SUMMER_GAMES_2016.icon.png'),
            logo: require('./assets/events/SUMMER_GAMES_2016.logo.png'),
            background: require('./assets/events/SUMMER_GAMES_2016.background.jpg'),
        },
        [Events.JUNKENSTEINS_REVENGE_2016]: {
            id: Events.JUNKENSTEINS_REVENGE_2016,
            code: 'JUNKENSTEINS_REVENGE_2016',
            icon: require('./assets/events/JUNKENSTEINS_REVENGE_2016.icon.png'),
            logo: require('./assets/events/JUNKENSTEINS_REVENGE_2016.logo.png'),
            background: require('./assets/events/JUNKENSTEINS_REVENGE_2016.background.jpg'),
        },
        [Events.WINTER_WONDERLAND_2016]: {
            id: Events.WINTER_WONDERLAND_2016,
            code: 'WINTER_WONDERLAND_2016',
            icon: require('./assets/events/WINTER_WONDERLAND_2016.icon.png'),
            logo: require('./assets/events/WINTER_WONDERLAND_2016.logo.png'),
            background: require('./assets/events/WINTER_WONDERLAND_2016.background.jpg'),
        },
        [Events.YEAR_OF_THE_ROOSTER_2017]: {
            id: Events.YEAR_OF_THE_ROOSTER_2017,
            code: 'YEAR_OF_THE_ROOSTER_2017',
            icon: require('./assets/events/YEAR_OF_THE_ROOSTER_2017.icon.png'),
            logo: require('./assets/events/YEAR_OF_THE_ROOSTER_2017.logo.png'),
            background: require('./assets/events/YEAR_OF_THE_ROOSTER_2017.background.jpg'),
        },
    };

    static get(id) {
        return Events.ITEMS[id];
    }
}

"use strict";

import {
    StackNavigator,
} from 'react-navigation';

import SplashScreen from './SplashScreen';
import WelcomeScreen from './WelcomeScreen';
import MainScreen from './MainScreen';
import EventScreen from './EventScreen';
import ItemsScreen from './ItemsScreen';
import SettingsScreen from './SettingsScreen';
import AboutScreen from './AboutScreen';

export default StackNavigator({
    Splash: {
        screen: SplashScreen,
    },
    Welcome: {
        screen: WelcomeScreen,
    },
    Main: {
        screen: MainScreen,
    },
    Event: {
        screen: EventScreen,
    },
    Items: {
        screen: ItemsScreen,
    },
    Settings: {
        screen: SettingsScreen,
    },
    About: {
        screen: AboutScreen,
    },
}, {
    initialRouteName: 'Splash',
    navigationOptions: {
        header: null,
    },
});

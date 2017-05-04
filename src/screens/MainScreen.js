"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';

import CONFIG from './../config';
import _ from './../i18n';
import Events from './../Events';
import {
    Layout,
    Tabs,
    EventsList,
    HeroesList,
    IconsList,

    Quiz,
} from './../components';
import Screen from './Screen';

class EventsListTab extends Screen {
    static navigationOptions = {
        tabBarLabel: 'BUTTON__EVENTS',
        tabBarIcon: null,
    };

    quiz;

    onEventPress(item) {
        if (item.id === Events.GENERAL) {
            let props = {
                title: _(item.code),
                event: item,
                addHeroIcon: false,
            };

            this.application.navigate('Items', props);
        } else {
            this.application.navigate('Event', {event: item,});
        }
    }

    onEventLongPress(item) {
        if (item.id === Events.SPECIAL) {
            this.quiz.open();
        }
    }

    render() {
        return (
            <View style={{flex: 1,}}>
                <Quiz ref={component => this.quiz = component}/>
                <EventsList
                    onItemPress={(item, index) => this.onEventPress(item)}
                    onItemLongPress={(item, index) => this.onEventLongPress(item)}
                />
            </View>
        );
    }
}

class HeroesListTab extends Screen {
    static navigationOptions = {
        tabBarLabel: 'BUTTON__HEROES',
        tabBarIcon: null,
    };

    onHeroPress(item) {
        let props = {
            title: _(item.code),
            hero: item,
            addHeroIcon: false,
            addEventIcon: true,
        };

        this.application.navigate('Items', props);
    }

    render() {
        return (
            <HeroesList onItemPress={(item, index) => this.onHeroPress(item)}/>
        );
    }
}

class IconsListTab extends Screen {
    static navigationOptions = {
        tabBarLabel: 'BUTTON__ICONS',
        tabBarIcon: null,
    };

    render() {
        return (
            <IconsList/>
        );
    }
}

export default class MainScreen extends Screen {
    language;

    constructor(props, context, updater) {
        super(props, context, updater);

        this.language = CONFIG.LANGUAGE;
    }

    componentWillReceiveProps(nextProps) {
        if (this.language !== CONFIG.LANGUAGE) {
            this.language = CONFIG.LANGUAGE;
        }
    }

    onToolbarActionSelected(index) {
        switch (index) {
            case 0:
                this.application.navigate('Settings');
                break;
            case 1:
                this.application.navigate('About');
                break;
        }
    }

    render() {
        return (
            <Layout
                toolbarTitle="OW Items Tracker"
                toolbarActions={[
                    {title: '', iconName: 'settings', show: 'always',},
                    {title: '', iconName: 'info', show: 'always',},
                ]}
                onToolbarActionSelected={index => this.onToolbarActionSelected(index)}
            >

                <Tabs
                    items={[EventsListTab, HeroesListTab, IconsListTab,]}
                    screenProps={{application: this.application,}}
                />

            </Layout>
        );
    }
}

const styles = StyleSheet.create({});

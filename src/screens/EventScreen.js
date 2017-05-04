"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
} from 'react-native';

import _ from './../i18n';
import Items from './../Items';
import {
    Layout,
    Tabs,
    HeroesList,
    ItemsList,
} from './../components';
import Screen from './Screen';

class ItemsListTab extends Screen {
    static navigationOptions = {
        tabBarLabel: 'BUTTON__BY_TYPE',
        tabBarIcon: null,
    };

    render() {
        return (
            <ItemsList event={this.props.screenProps.event}/>
        );
    }
}

class HeroesListTab extends Screen {
    static navigationOptions = {
        tabBarLabel: 'BUTTON__BY_HEROES',
        tabBarIcon: null,
    };

    onHeroPress(item) {
        let props = {
            title: _(item.code),
            hero: item,
            event: this.props.screenProps.event,
            isCollapsible: false,
            addHeroIcon: false,
        };

        this.application.navigate('Items', props);
    }

    render() {
        return (
            <HeroesList
                progressEvent={this.props.screenProps.event}
                onItemPress={(item, index) => this.onHeroPress(item)}
            />
        );
    }
}

export default class EventScreen extends Screen {
    params = {};

    constructor(props, context, updater) {
        super(props, context, updater);

        this.params = Object.assign(this.params, this.props.navigation.state.params);

        this.state = {
            event: this.params.event,
            items: [],
        };
    }

    onToolbarActionSelected(index) {
        switch (index) {
            case 0:
                this.checkAll();
                break;
        }
    }

    checkAll() {
        Items.select(null, null, null, null, this.state.event.id).map(item => {
            Items.receiveItem(item.uid, true);
        });

        this.forceUpdate();
    }

    render() {
        return (
            <Layout
                toolbarTitle={_(this.state.event.code)}
                toolbarActions={[
                    {title: _('BUTTON__CHECK_ALL'), iconName: 'check',},
                ]}
                onToolbarIconPress={() => this.application.back()}
                onToolbarActionSelected={index => this.onToolbarActionSelected(index)}
                background={this.state.event.background}
            >

                <Tabs
                    items={[ItemsListTab, HeroesListTab,]}
                    screenProps={{application: this.application, event: this.state.event,}}
                />

            </Layout>
        );
    }
}

const styles = StyleSheet.create({});

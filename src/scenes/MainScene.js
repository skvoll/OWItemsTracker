"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {TabViewAnimated} from 'react-native-tab-view';

import CONFIG from './../config';
import _ from './../i18n';
import Events from './../Events';
import {
    Layout,
    ButtonsGroup,
    EventsList,
    HeroesList,
    IconsList,

    Quiz,
} from './../components';
import Scene from './Scene';

export class MainScene extends Scene {
    static propTypes = {};

    static defaultProps = {};

    tabHeader;
    quiz;

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            index: 0,
            routes: [
                {key: 'events', title: _('BUTTON__EVENTS'),},
                {key: 'heroes', title: _('BUTTON__HEROES'),},
                {key: 'icons', title: _('BUTTON__ICONS'),},
            ],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.state.routes[0].title !== _('BUTTON__EVENTS')
            || this.state.routes[1].title !== _('BUTTON__HEROES')
            || this.state.routes[2].title !== _('BUTTON__ICONS')
        ) {
            this.setState({
                routes: [
                    {key: 'events', title: _('BUTTON__EVENTS'),},
                    {key: 'heroes', title: _('BUTTON__HEROES'),},
                    {key: 'icons', title: _('BUTTON__ICONS'),},
                ],
            });
        }
    }

    onEventPress(item) {
        if (item.id === Events.GENERAL) {
            let props = {
                title: _(item.code),
                event: item,
                addHeroIcon: false,
            };

            this.navigator.push({name: 'ItemsScene', props: props,});
        } else {
            this.navigator.push({name: 'EventScene', props: {item: item,},});
        }
    }

    onEventLongPress(item) {
        if (item.id === Events.SPECIAL) {
            this.quiz.open();
        }
    }

    onHeroPress(item) {
        let props = {
            title: _(item.code),
            hero: item,
            addHeroIcon: false,
            addEventIcon: true,
        };

        this.navigator.push({name: 'ItemsScene', props: props,});
    }

    tabRenderHeader() {
        let actions = [];

        this.state.routes.map((item, index) => {
            actions.push({
                title: item.title, action: () => {
                    this.setState({
                        index: index,
                    });
                }, isActive: this.state.index === index,
            });
        });

        return (
            <View style={styles.filter}>
                <ButtonsGroup ref={(component) => this.tabHeader = component} items={actions}/>
            </View>
        );
    }

    tabRenderScene({route}) {
        switch (route.key) {
            case 'events':
                return (
                    <EventsList
                        onItemPress={(item, index) => this.onEventPress(item)}
                        onItemLongPress={(item, index) => this.onEventLongPress(item)}
                    />
                );
                break;
            case 'heroes':
                return (<HeroesList onItemPress={(item, index) => this.onHeroPress(item)}/>);
                break;
            case 'icons':
                return (<IconsList/>);
                break;
        }
    }

    tabHandleChangePosition(position) {
        this.tabHeader.setState({
            active: Math.round(position),
        });
    }

    tabHandleChangeTab(index) {
        this.setState({
            index: index,
        });
    }

    onToolbarActionSelected(index) {
        let currentRoutes = this.navigator.getCurrentRoutes();

        let navigatePush = (route, props = {}) => {
            if (currentRoutes.length > 1) {
                return;
            }

            this.navigator.push({name: route, props: props,});
        };

        switch (index) {
            case 0:
                navigatePush('SettingsScene');
                break;
            case 1:
                navigatePush('AboutScene');
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
                onToolbarActionSelected={(index) => this.onToolbarActionSelected(index)}
            >

                <Quiz ref={(component) => this.quiz = component}/>

                <TabViewAnimated
                    navigationState={this.state}
                    renderHeader={() => this.tabRenderHeader()}
                    renderScene={(route) => this.tabRenderScene(route)}
                    onChangePosition={(position) => this.tabHandleChangePosition(position)}
                    onRequestChangeTab={(index) => this.tabHandleChangeTab(index)}
                    style={styles.tabs}
                />

            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    tabs: {
        flex: 1,
    },
    filter: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

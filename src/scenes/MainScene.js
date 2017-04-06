"use strict";

import React, {Component} from 'react';
import {
    AsyncStorage,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import {TabViewAnimated} from 'react-native-tab-view';

import CONFIG from './../config';
import _ from './../l10n';
import Events from './../Events';
import {
    Layout,
    SimpleModal,
    ButtonsGroup,
    EventsList,
    HeroesList,
    IconsList,
} from './../components';
import Scene from './Scene';

export class MainScene extends Scene {
    static propTypes = {};

    static defaultProps = {};

    tabHeader;
    whatsNewModal;

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            index: 0,
            routes: [
                {key: 'events', title: _('EVENTS'),},
                {key: 'heroes', title: _('HEROES'),},
                {key: 'icons', title: _('ICONS'),},
            ],
        };
    }

    componentWillMount() {
        this.showWhatsNew();
    }

    componentWillReceiveProps(nextProps) {
        if (
            this.state.routes[0].title !== _('EVENTS')
            || this.state.routes[1].title !== _('HEROES')
            || this.state.routes[2].title !== _('ICONS')
        ) {
            this.setState({
                routes: [
                    {key: 'events', title: _('EVENTS'),},
                    {key: 'heroes', title: _('HEROES'),},
                    {key: 'icons', title: _('ICONS'),},
                ],
            });
        }
    }

    showWhatsNew() {
        if (!_('WHATS_NEW_TEXT', false)) {
            return;
        }

        AsyncStorage.getItem('WHATS_NEW_SHOWN').then((version) => {
            if (version === CONFIG.VERSION) {
                return;
            }

            this.whatsNewModal.open();
        }).catch(() => null);
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
                    this.dontTrackTabPosition = true;
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
                return (<EventsList onItemPress={(item, index) => this.onEventPress(item)}/>);
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
        switch (index) {
            case 0:
                this.navigator.push({name: 'SettingsScene', props: {},});
                break;
            case 1:
                this.navigator.push({name: 'AboutScene', props: {},});
                break;
        }
    }

    render() {
        let whatsNewModal;

        if (_('WHATS_NEW_TEXT', false)) {
            whatsNewModal = (
                <SimpleModal
                    ref={(component) => this.whatsNewModal = component}
                    title={`${_('WHATS_NEW_TITLE')} ${_('IN')} ${CONFIG.VERSION}`}
                    actions={[
                        {title: 'remind later', icon: 'watch-later', action: () => this.whatsNewModal.close(),},
                        {title: 'close', icon: 'close', action: () => {
                            this.whatsNewModal.close();
                            AsyncStorage.setItem('WHATS_NEW_SHOWN', CONFIG.VERSION);
                        },},
                    ]}
                >

                    <Text style={styles.modalText}>{_('WHATS_NEW_TEXT')}</Text>

                </SimpleModal>
            );
        }

        return (
            <Layout
                toolbarTitle="OW Items Tracker"
                toolbarActions={[
                    {title: '', iconName: 'settings', show: 'always',},
                    {title: '', iconName: 'info', show: 'always',},
                ]}
                onToolbarActionSelected={(index) => this.onToolbarActionSelected(index)}
            >

                {whatsNewModal}

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
    modalText: {
        fontSize: 18,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.COMMON,
    },
    filter: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabs: {
        flex: 1,
    },
});

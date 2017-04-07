"use strict";

import React, {Component} from 'react';
import {
    AsyncStorage,
    StyleSheet,
    View,
    ScrollView,
    Image,
    Text,
} from 'react-native';
import {TabViewAnimated} from 'react-native-tab-view';

import CONFIG from './../config';
import _ from './../l10n';
import Events from './../Events';
import {
    Layout,
    ButtonsGroup,
    EventsList,
    HeroesList,
    IconsList,
} from './../components';
import {SimpleModal} from './../components/SimpleModal';
import Scene from './Scene';

class WelcomeModal extends SimpleModal {
    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            isVisible: this.props.isVisible,
            actions: [
                {title: _('REMIND_LATER'), icon: 'watch-later', action: () => this.close(),},
                {title: _('CLOSE'), icon: 'close', action: () => {
                    this.close();
                    AsyncStorage.setItem('WELCOME_SHOWN', 'true');
                },},
            ],
            index: 0,
            routes: [],
        };
    }

    componentDidMount() {
        this.showTips()
    }

    showTips() {
        AsyncStorage.getItem('WELCOME_SHOWN').then((WELCOME_SHOWN) => {
            if (WELCOME_SHOWN) {
                this.showWhatsNew();

                return;
            }

            let routes = [], tips = [
                require('./../assets/tips/tip1.jpg'),
                require('./../assets/tips/tip2.jpg'),
                require('./../assets/tips/tip3.jpg'),
                require('./../assets/tips/tip4.jpg'),
            ];

            tips.map((tip, index) => {
                routes.push({
                    key: index.toString(),
                    content: (
                        <View style={styles.modalSlide}>
                            <Image source={tip} style={styles.modalSlideImage}/>
                        </View>
                    ),
                });
            });

            this.setState({
                routes: routes,
            });

            this.open(_('TIPS'));
        }).catch(() => null);
    }

    showWhatsNew() {
        if (!_('WHATS_NEW_TEXT', false)) {
            return;
        }

        AsyncStorage.getItem('WHATS_NEW_SHOWN').then((version) => {
            if (!version) {
                AsyncStorage.setItem('WHATS_NEW_SHOWN', CONFIG.VERSION);

                return;
            }

            if (version === CONFIG.VERSION) {
                return;
            }

            let routes = [{
                key: '0',
                content: (
                    <ScrollView contentContainerStyle={styles.modalSlide}>
                        <Text style={styles.modalText}>{_('WHATS_NEW_TEXT')}</Text>
                    </ScrollView>
                ),
            }], tips = [
                require('./../assets/tips/tip3.jpg'),
            ];

            tips.map((tip, index) => {
                routes.push({
                    key: (index + 1).toString(),
                    content: (
                        <View style={styles.modalSlide}>
                            <Image source={tip} style={styles.modalSlideImage}/>
                        </View>
                    ),
                });
            });

            this.setState({
                routes: routes,
            });

            this.open(`${_('WHATS_NEW_TITLE')} ${_('IN')} ${CONFIG.VERSION}`);
        }).catch(() => null);
    }

    tabRenderFooter() {
        let items = [];

        this.state.routes.map((item, index) => {
            items.push(
                <View
                    key={index}
                    style={[
                        styles.modalPagerItem,
                        (this.state.index === index ? styles.modalPagerItemActive : null)
                    ]}
                />
            );
        });

        if (items.length === 0) {
            return null;
        }

        return (
            <View style={styles.modalPager}>
                {items}
            </View>
        );
    }

    tabRenderScene({route}) {
        return route.content;
    }

    tabHandleChangeTab(index) {
        this.setState({
            index: index,
        });
    }

    renderContent() {
        return (
            <TabViewAnimated
                navigationState={this.state}
                renderFooter={() => this.tabRenderFooter()}
                renderScene={(route) => this.tabRenderScene(route)}
                onRequestChangeTab={(index) => this.tabHandleChangeTab(index)}
                style={styles.tabs}
            />
        );
    }
}

export class MainScene extends Scene {
    static propTypes = {};

    static defaultProps = {};

    tabHeader;

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
        return (
            <Layout
                toolbarTitle="OW Items Tracker"
                toolbarActions={[
                    {title: '', iconName: 'settings', show: 'always',},
                    {title: '', iconName: 'info', show: 'always',},
                ]}
                onToolbarActionSelected={(index) => this.onToolbarActionSelected(index)}
            >

                <WelcomeModal/>

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
    modalPager: {
        height: 48,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalPagerItem: {
        height: 8,
        width: 8,
        marginHorizontal: 4,
        borderRadius: 4,
        backgroundColor: CONFIG.COLORS.LIGHT_BLUE,
    },
    modalPagerItemActive: {
        height: 12,
        width: 12,
        borderRadius: 6,
    },
    modalSlide: {
        flex: 1,
        padding: 8,
    },
    modalSlideImage: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: 'contain',
    },
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

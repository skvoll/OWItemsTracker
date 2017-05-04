"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Text,
} from 'react-native';

import CONFIG from './../config';
import _ from './../i18n';
import {LANGUAGES} from './../i18n';
import {
    Layout,
    Tabs,
    Link,
    Button,
} from './../components';
import Screen from './Screen';

class NewsTab extends Screen {
    static navigationOptions = {
        tabBarLabel: 'news',
        tabBarIcon: null,
    };

    render() {
        return (
            <ScrollView style={styles.tab} contentContainerStyle={styles.contentContainerStyle}>
                <Image
                    source={require('./../assets/news/news1.jpg')}
                    style={{width: '100%', alignSelf: 'center',}}
                />
                <Text style={{margin: 8, fontSize: 18, fontFamily: 'Futura', color: CONFIG.COLORS.COMMON,}}>
                    {`${_('OTHER__THANKS_FOR_TRANSLATION')}:`}
                </Text>
                <Link
                    title={LANGUAGES.de_DE.translators[0].name}
                    href={LANGUAGES.de_DE.translators[0].link}
                    icon={LANGUAGES.de_DE.translators[0].icon}
                    backgroundColor={CONFIG.COLORS.GRAY_BLUE}
                />
                <Text style={styles.text}>{_('WELCOME__NEWS_TEXT')}</Text>
                <Link
                    title={_('WELCOME__LINK_TITLE').toUpperCase()}
                    href="https://github.com/skvoll/OWItemsTracker/wiki/Translations"
                    icon="globe"
                    backgroundColor={CONFIG.COLORS.LEGENDARY}
                />
            </ScrollView>
        );
    }
}

class TipTab extends Screen {
    static navigationOptions = {
        tabBarLabel: null,
        tabBarIcon: null,
    };

    getImage() {
        return null;
    }

    render() {
        return (
            <View style={styles.tab}>
                <Image source={this.getImage()} style={styles.tip}/>
            </View>
        );
    }
}

class TipTab1 extends TipTab {
    static navigationOptions = {
        tabBarLabel: 'tip 1',
        tabBarIcon: null,
    };

    getImage() {
        return require('./../assets/tips/tip1.jpg');
    }
}

class TipTab2 extends TipTab {
    static navigationOptions = {
        tabBarLabel: 'tip 2',
        tabBarIcon: null,
    };

    getImage() {
        return require('./../assets/tips/tip2.jpg');
    }
}

class TipTab3 extends TipTab {
    static navigationOptions = {
        tabBarLabel: 'tip 3',
        tabBarIcon: null,
    };

    getImage() {
        return require('./../assets/tips/tip3.jpg');
    }
}

class TipTab4 extends TipTab {
    static navigationOptions = {
        tabBarLabel: 'tip 4',
        tabBarIcon: null,
    };

    getImage() {
        return require('./../assets/tips/tip4.jpg');
    }
}

export default class WelcomeScreen extends Screen {
    params = {
        type: 'news',
    };

    constructor(props, context, updater) {
        super(props, context, updater);

        this.params = Object.assign(this.params, this.props.navigation.state.params);

        let types = {
            news: {
                title: _('WELCOME__NEWS_TITLE'),
                index: 0,
                tabs: [NewsTab,],
            },
            tips: {
                title: _('WELCOME__TIPS_TITLE'),
                index: 0,
                tabs: [TipTab1, TipTab2, TipTab3, TipTab4,],
            },
        };

        this.state = types[this.params.type];
    }

    onClose() {
        this.application.reset('Main');
    }

    render() {
        return (
            <Layout
                toolbarTitle={this.state.title}
                background={CONFIG.COLORS.DARK_BLUE}
            >

                <Tabs
                    items={this.state.tabs}
                    screenProps={{application: this.application,}}
                    tabBar="pager"
                />

                <View style={styles.footer}>
                    <Button title={_('BUTTON__CLOSE')} icon="close" onPress={() => this.onClose()}/>
                </View>

            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    tab: {
        flex: 1,
    },
    tabContentContainerStyle: {},
    footer: {
        padding: 8,
    },
    text: {
        margin: 16,
        fontSize: 18,
        fontFamily: 'Futura',
        textAlign: 'center',
        color: CONFIG.COLORS.COMMON,
    },
    tip: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: 'contain',
    },
});

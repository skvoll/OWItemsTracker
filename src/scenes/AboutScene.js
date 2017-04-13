"use strict";

import React, {Component} from 'react';
import {
    Linking,
    StyleSheet,
    View,
    ScrollView,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconSocial from 'react-native-vector-icons/FontAwesome';

import CONFIG from './../config';
import _ from './../l10n';
import {
    Layout,
    Touchable,
} from './../components';
import Scene from './Scene';

class Link extends Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        href: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string,
    };

    static defaultProps = {};

    onPress() {
        Linking.openURL(this.props.href);
    }

    render() {
        let icon;

        if (this.props.icon) {
            icon = (
                <IconSocial
                    name={this.props.icon}
                    size={24}
                    color="#FFFFFF"
                />
            );
        }

        return (
            <Touchable onPress={() => this.onPress()}>
                <View style={styles.link}>
                    {icon}
                    <Text style={styles.linkTitle}>{this.props.title}</Text>
                    <Icon
                        name="open-in-browser"
                        size={24}
                        color="#FFFFFF"
                    />
                </View>
            </Touchable>
        );
    }
}

export class AboutScene extends Scene {
    constructor(props, context, updater) {
        super(props, context, updater);

        this.hardwareBackPress = () => this.navigationPop();
    }

    render() {
        return (
            <Layout
                toolbarTitle={_('ABOUT__INFORMATION_TITLE')}
                onToolbarIconPress={() => this.navigationPop()}
                background={require('./../assets/background_about_gray.jpg')}
                styles={styles.container}
            >

                <View style={styles.top}/>
                <ScrollView style={styles.center} contentContainerStyle={styles.centerContentContainerStyle}>
                    <Text style={styles.label}>{`${_('ABOUT__ABOUT_TITLE').toUpperCase()}`}</Text>
                    <View style={styles.section}>
                        <Text style={styles.text}>{_('ABOUT__ABOUT_TEXT')}</Text>
                    </View>
                    <Text style={styles.label}>{`${_('ABOUT__COPYRIGHT_TITLE').toUpperCase()}`}</Text>
                    <View style={styles.section}>
                        <Text style={styles.text}>{_('ABOUT__COPYRIGHT_TEXT')}</Text>
                    </View>
                    <Text style={styles.label}>{`${_('ABOUT__DEVELOPERS_TITLE').toUpperCase()}`}</Text>
                    <View style={styles.section}>
                        <Text style={styles.title}>{`${_('ABOUT__CODE')}:`.toUpperCase()}</Text>
                        <Link title="david volkov" href="http://davidvolkov.tech"/>
                        <Text style={styles.title}>{`${_('ABOUT__DESIGN')}:`.toUpperCase()}</Text>
                        <Link title="dmitry kurashkin" href="https://www.reddit.com/user/dimitryk_52"/>
                        <Text style={styles.title}>{`${_('ABOUT__SPECIAL_THANKS')}:`.toUpperCase()}</Text>
                        <Link icon="vk" title="danila semenov" href="https://vk.com/mhgny"/>
                        <Link icon="reddit-alien" title="/u/FixKun" href="https://www.reddit.com/user/FixKun"/>
                    </View>
                    <Text style={styles.label}>{`${_('ABOUT__THANKS_TITLE').toUpperCase()}`}</Text>
                    <View style={styles.section}>
                        <Text style={styles.title}>{`${_('ABOUT__IDEA_AND_INITIAL_DESIGN')}:`.toUpperCase()}</Text>
                        <Link icon="reddit-alien" title="/u/izzepizze" href="https://www.reddit.com/user/izzepizze"/>
                        <Text style={styles.title}>{`${_('ABOUT__SOURCES_AND_ASSETS')}:`.toUpperCase()}</Text>
                        <Link icon="reddit-alien" title="/u/js41637" href="https://www.reddit.com/user/js41637"/>
                        <Link icon="github" title="js41637" href="https://github.com/Js41637"/>
                        <Link title="Overwatch Item Tracker" href="https://js41637.github.io/Overwatch-Item-Tracker"/>
                        <Link icon="github" title="Overwatch Item Tracker" href="https://github.com/Js41637/Overwatch-Item-Tracker"/>
                        <Text style={styles.title}>{`${_('ABOUT__COMMUNITY')}:`.toUpperCase()}</Text>
                        <Link icon="reddit-alien" title="/r/overwatch" href="https://www.reddit.com/r/overwatch"/>
                    </View>
                </ScrollView>
                <View style={styles.bottom}>
                    <Text
                        onPress={() => this.navigator.push({name: 'WelcomeScene', props: {},})}
                        style={styles.version}
                    >

                        {`${_('SETTINGS__VERSION').toUpperCase()}: ${CONFIG.VERSION}`}

                    </Text>
                </View>

            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    top: {},
    center: {
        flex: 1,
    },
    centerContentContainerStyle: {},
    bottom: {},
    label: {
        marginHorizontal: 16,
        fontSize: 32,
        fontFamily: 'BigNoodleToo',
        color: CONFIG.COLORS.LIGHT_BLUE,
    },
    section: {
        paddingTop: 8,
        paddingBottom: 16,
    },
    title: {
        marginHorizontal: 16,
        fontSize: 18,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.LEGENDARY,
    },
    text: {
        marginHorizontal: 16,
        fontSize: 16,
        fontFamily: 'Futura',
        color: '#F5F5F5',
    },
    version: {
        fontSize: 11,
        padding: 16,
        fontFamily: 'Futura',
        color: '#F5F5F5',
    },
    link: {
        height: 48,
        marginVertical: 2,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CONFIG.COLORS.DARK_BLUE_OPACITY,
    },
    linkTitle: {
        flex: 1,
        marginHorizontal: 8,
        fontSize: 18,
        fontFamily: 'Futura',
        color: '#F5F5F5',
    },
});

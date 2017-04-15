"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
} from 'react-native';

import CONFIG from './../config';
import _ from './../l10n';
import {LANGUAGES} from './../l10n';
import {
    Layout,
    Link,
} from './../components';
import Scene from './Scene';

export class AboutScene extends Scene {
    constructor(props, context, updater) {
        super(props, context, updater);

        this.hardwareBackPress = () => this.navigationPop();
    }

    render() {
        let translators = {}, translatorsSection = [];

        Object.values(LANGUAGES).map((language) => {
            if (language.translators.length > 0) {
                translators[language.name] = [];

                language.translators.map((translator) => {
                    translators[language.name].push(translator);
                });
            }
        });

        if (Object.keys(translators).length > 0) {
            for (let i in translators) if (translators.hasOwnProperty(i)) {
                translatorsSection.push(
                    <Text key={`translators-${i}`} style={styles.title}>
                        {`${i}:`.toUpperCase()}
                    </Text>
                );
                translators[i].map((translator, index) => {
                    translatorsSection.push(
                        <Link
                            key={`translators-${i}-${index}`}
                            icon={translator.icon}
                            title={translator.name}
                            href={translator.link}
                        />
                    );
                });
            }
        }

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
                        <Text style={styles.title}>{`${_('ABOUT__DESIGN_AND_CONTENT')}:`.toUpperCase()}</Text>
                        <Link title="dmitry kurashkin" href="https://www.reddit.com/user/dimitryk_52"/>
                        <Text style={styles.title}>{`${_('ABOUT__SMM')}:`.toUpperCase()}</Text>
                        <Link title="danila semenov" href="https://vk.com/mhgny"/>
                    </View>
                    <Text style={styles.label}>{`${_('ABOUT__TRANSLATORS_TITLE').toUpperCase()}`}</Text>
                    <View style={styles.section}>
                        {translatorsSection}
                    </View>
                    <Text style={styles.label}>{`${_('ABOUT__THANKS_TITLE').toUpperCase()}`}</Text>
                    <View style={styles.section}>
                        <Text style={styles.title}>{`${_('ABOUT__IDEA_AND_INITIAL_DESIGN')}:`.toUpperCase()}</Text>
                        <Link icon="reddit-alien" title="/u/izzepizze" href="https://www.reddit.com/user/izzepizze"/>
                        <Text style={styles.title}>{`${_('ABOUT__SOURCES_AND_ASSETS')}:`.toUpperCase()}</Text>
                        <Link icon="reddit-alien" title="/u/js41637" href="https://www.reddit.com/user/js41637"/>
                        <Link icon="github" title="js41637" href="https://github.com/Js41637"/>
                        <Link title="Overwatch Item Tracker" href="https://js41637.github.io/Overwatch-Item-Tracker"/>
                        <Link icon="github" title="Overwatch Item Tracker"
                              href="https://github.com/Js41637/Overwatch-Item-Tracker"/>
                        <Text style={styles.title}>{`${_('ABOUT__COMMUNITY')}:`.toUpperCase()}</Text>
                        <Link icon="reddit-alien" title="/r/overwatch" href="https://www.reddit.com/r/overwatch"/>
                    </View>
                </ScrollView>
                <View style={styles.bottom}>
                    <Text
                        onLongPress={() => this.navigator.push({name: 'WelcomeScene', props: {},})}
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
    container: {},
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
});

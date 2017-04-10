"use strict";

import React, {Component} from 'react';
import {
    AsyncStorage,
    Alert,
    StyleSheet,
    View,
    ScrollView,
} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';

import CONFIG from './../config';
import _ from './../l10n';
import {LANGUAGES} from './../l10n';
import CloudStorage from './../CloudStorage';
import Items from './../Items';
import {
    Layout,
    Button,
    ButtonPicker,
} from './../components';
import Scene from './Scene';

export class SettingsScene extends Scene {
    constructor(props, context, updater) {
        super(props, context, updater);

        this.hardwareBackPress = () => this.navigationPop();

        this.state = {
            hasPlayServices: false,
            language: CONFIG.LANGUAGE,
            includeIconsInProgress: CONFIG.INCLUDE_ICONS_IN_PROGRESS,
            includeSpecialsInProgress: CONFIG.INCLUDE_SPECIALS_IN_PROGRESS,
            profile: CONFIG.PROFILE || null,
        };
    }

    componentWillMount() {
        let configure = () => {
            GoogleSignin.configure(CONFIG.GOOGLE_SIGNIN).then(() => {
                this.setState({
                    hasPlayServices: true,
                });
            });
        };

        if (CONFIG.PLATFORM === 'android') {
            GoogleSignin.hasPlayServices({autoResolve: true,}).then(configure()).catch((error) => null);
        } else {
            configure();
        }
    }

    setLanguage(language) {
        this.setState({
            language: language,
        }, () => {
            CONFIG.set('LANGUAGE', language).then(() => {
                this.forceUpdate();
            });
        });
    }

    toggleIncludeIcons() {
        CONFIG.set('INCLUDE_ICONS_IN_PROGRESS', !this.state.includeIconsInProgress).then(() => {
            this.setState({
                includeIconsInProgress: !this.state.includeIconsInProgress,
            });
        });
    }

    toggleIncludeSpecials() {
        CONFIG.set('INCLUDE_SPECIALS_IN_PROGRESS', !this.state.includeSpecialsInProgress).then(() => {
            this.setState({
                includeSpecialsInProgress: !this.state.includeSpecialsInProgress,
            });
        });
    }

    cloudSynchronization() {
        if (!this.state.hasPlayServices) {
            return;
        }

        if (this.state.profile) {
            Alert.alert(_('CLOUD_SYNCHRONIZATION'), `${ _('CONNECTED_ACCOUNT')}: ${this.state.profile.name}`, [
                {text: _('CANCEL'), onPress: () => null, style: 'cancel'},
                {text: _('TURN_OFF'), onPress: async () => {
                    if (CONFIG.NETWORK === 'NONE') {
                        Alert.alert(_('NO_INTERNET_CONNECTION'), '');

                        return;
                    }

                    await CloudStorage.remove('/items');
                    GoogleSignin.revokeAccess().then(() => {
                        CONFIG.remove(['CLOUD_SYNCHRONIZATION', 'PROFILE',]).then(() => {
                            this.setState({
                                profile: null,
                            }, () => Items.initialize());
                        });
                    }).catch((error) => console.log(error));
                }},
            ]);

            return;
        }

        Alert.alert(_('CLOUD_SYNCHRONIZATION'), _('CLOUD_SYNCHRONIZATION_CONFIRM'), [
            {text: _('CANCEL'), onPress: () => null, style: 'cancel'},
            {text: _('SIGN_IN'), onPress: () => {
                if (CONFIG.NETWORK === 'NONE') {
                    Alert.alert(_('NO_INTERNET_CONNECTION'), '');

                    return;
                }

                GoogleSignin.signIn().then((user) => {
                    let profile = {
                        id: user.id,
                        name: user.name,
                    };

                    CONFIG.set({
                        CLOUD_SYNCHRONIZATION: true,
                        PROFILE: profile,
                    }).then(() => {
                        this.setState({
                            profile: profile,
                        }, () => Items.initialize());
                    });
                }).catch((error) => console.log(error));
            }},
        ]);
    }

    eraseData() {
        Alert.alert(_('CLEARING_DATA'), _('CLEARING_DATA_CONFIRM'), [
            {text: _('CANCEL'), onPress: () => null, style: 'cancel'},
            {text: _('CLEAR'), onPress: () => {
                AsyncStorage.removeItem('TIPS_SHOWN');
                AsyncStorage.removeItem('WHATS_NEW_VERSION');
                Items.clear();
            }},
        ]);
    }

    render() {
        let languages = [], btnSync, btnSyncTitle = _('CLOUD_SYNCHRONIZATION');

        for (let i in LANGUAGES) if (LANGUAGES.hasOwnProperty(i)) {
            languages.push({label: LANGUAGES[i].name.toUpperCase(), value: i});
        }

        if (this.state.hasPlayServices) {
            if (this.state.profile) {
                btnSyncTitle += `: ${_('IS_ON')}` ;
            } else {
                btnSyncTitle += `: ${_('IS_OFF')}` ;
            }

            btnSync = (
                <View style={styles.section}>
                    <Button
                        title={btnSyncTitle.toUpperCase()}
                        onPress={() => this.cloudSynchronization()}
                    />
                </View>
            );
        }

        return (
            <Layout
                toolbarTitle={_('SETTINGS')}
                onToolbarIconPress={() => this.navigationPop()}
                styles={styles.container}
            >

                <View style={styles.top}>

                </View>
                <ScrollView style={styles.center} contentContainerStyle={styles.centerContentContainerStyle}>
                    <View style={styles.section}>
                        <ButtonPicker
                            values={languages}
                            selectedValue={this.state.language}
                            onValueChange={(language) => this.setLanguage(language)}
                            title={_('LANGUAGE').toUpperCase()}
                            icon="close"
                        />
                    </View>
                    <View style={styles.section}>
                        <Button
                            title={`${_('INCLUDE_ICONS_IN_PROGRESS')}: ${this.state.includeIconsInProgress ? _('IS_ON') : _('IS_OFF')}`.toUpperCase()}
                            onPress={() => this.toggleIncludeIcons()}
                        />
                    </View>
                    <View style={styles.section}>
                        <Button
                            title={`${_('INCLUDE_SPECIALS_IN_PROGRESS')}: ${this.state.includeSpecialsInProgress ? _('IS_ON') : _('IS_OFF')}`.toUpperCase()}
                            onPress={() => this.toggleIncludeSpecials()}
                        />
                    </View>
                    {btnSync}
                </ScrollView>
                <View style={styles.bottom}>
                    <View style={styles.section}>
                        <Button
                            title={_('CLEAR_DATA').toUpperCase()}
                            onPress={() => this.eraseData()}
                            color={CONFIG.COLORS.RED}
                            icon="close"
                        />
                    </View>
                </View>

            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    container: {
    },
    top: {
        paddingHorizontal: 8,
    },
    center: {
        flex: 1,
    },
    centerContentContainerStyle: {
        paddingHorizontal: 8,
    },
    bottom: {
        paddingHorizontal: 8,
    },
    section: {
        paddingVertical: 8,
    },
    text: {
        color: '#F5F5F5',
    },
});

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
import _, {LANGUAGES} from './../i18n';
import CloudStorage from './../CloudStorage';
import Items from './../Items';
import {
    Layout,
    Button,
    ButtonPicker,
} from './../components';
import Screen from './Screen';

export default class SettingsScreen extends Screen {
    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            hasPlayServices: false,
            language: CONFIG.LANGUAGE,
            hqPreview: CONFIG.HQ_PREVIEW,
            includeIconsInProgress: CONFIG.INCLUDE_ICONS_IN_PROGRESS,
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
            GoogleSignin.hasPlayServices({autoResolve: true,}).then(configure()).catch(error => null);
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

    switchHQPreview() {
        let values = [true, 'WIFI', false], index, value;

        index = values.indexOf(this.state.hqPreview);

        if ((index + 1) > (values.length - 1)) {
            index = 0;
        } else {
            index++;
        }

        value = values[index];

        CONFIG.set('HQ_PREVIEW', value).then(() => {
            this.setState({
                hqPreview: value,
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

    cloudSynchronization() {
        if (!this.state.hasPlayServices) {
            return;
        }

        if (this.state.profile) {
            Alert.alert(_('SETTINGS__CLOUD_SYNCHRONIZATION_TITLE'), `${ _('SETTINGS__CONNECTED_ACCOUNT')}: ${this.state.profile.name}`, [
                {text: _('BUTTON__CANCEL'), onPress: () => null, style: 'cancel'},
                {text: _('BUTTON__TURN_OFF'), onPress: async () => {
                    if (CONFIG.NETWORK === 'NONE') {
                        Alert.alert(_('ERROR__NO_INTERNET_CONNECTION'), '');

                        return;
                    }

                    await CloudStorage.remove('/items');
                    GoogleSignin.revokeAccess().then(() => {
                        CONFIG.remove(['SETTINGS__CLOUD_SYNCHRONIZATION_TITLE', 'PROFILE',]).then(() => {
                            this.setState({
                                profile: null,
                            }, () => Items.initialize());
                        });
                    }).catch(error => console.log(error));
                }},
            ]);

            return;
        }

        Alert.alert(_('SETTINGS__CLOUD_SYNCHRONIZATION_TITLE'), _('SETTINGS__CLOUD_SYNCHRONIZATION_CONFIRM'), [
            {text: _('BUTTON__CANCEL'), onPress: () => null, style: 'cancel'},
            {text: _('BUTTON__SIGN_IN'), onPress: () => {
                if (CONFIG.NETWORK === 'NONE') {
                    Alert.alert(_('ERROR__NO_INTERNET_CONNECTION'), '');

                    return;
                }

                GoogleSignin.signIn().then(user => {
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
                }).catch(error => console.log(error));
            }},
        ]);
    }

    eraseData() {
        Alert.alert(_('SETTINGS__CLEARING_DATA_TITLE'), _('SETTINGS__CLEARING_DATA_CONFIRM'), [
            {text: _('BUTTON__CANCEL'), onPress: () => null, style: 'cancel'},
            {text: _('BUTTON__CLEAR'), onPress: () => {
                AsyncStorage.removeItem('TIPS_SHOWN');
                Items.clear();
            }},
        ]);
    }

    render() {
        let languages = [],
            btnHQPreviewTitle = `${_('SETTINGS__HQ_PREVIEW')}`,
            btnSync,
            btnSyncTitle = _('BUTTON__CLOUD_SYNCHRONIZATION');

        for (let i in LANGUAGES) if (LANGUAGES.hasOwnProperty(i)) {
            languages.push({label: LANGUAGES[i].name.toUpperCase(), value: i});
        }

        switch (this.state.hqPreview) {
            case true:
                btnHQPreviewTitle += `: ${_('SETTINGS__IS_ON')}`;
                break;
            case 'WIFI':
                btnHQPreviewTitle += `: ${_('SETTINGS__WIFI_ONLY')}`;
                break;
            case false:
                btnHQPreviewTitle += `: ${_('SETTINGS__IS_OFF')}`;
                break;
        }

        if (this.state.hasPlayServices) {
            if (this.state.profile) {
                btnSyncTitle += `: ${_('SETTINGS__IS_ON')}` ;
            } else {
                btnSyncTitle += `: ${_('SETTINGS__IS_OFF')}` ;
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
                toolbarTitle={_('SETTINGS__SETTINGS_TITLE')}
                onToolbarIconPress={() => this.application.back()}
                styles={styles.container}
            >

                <View style={styles.top}/>
                <ScrollView style={styles.center} contentContainerStyle={styles.centerContentContainerStyle}>
                    <View style={styles.section}>
                        <ButtonPicker
                            values={languages}
                            selectedValue={this.state.language}
                            onValueChange={language => this.setLanguage(language)}
                            title={_('SETTINGS__LANGUAGE').toUpperCase()}
                        />
                    </View>
                    <View style={styles.section}>
                        <Button
                            title={btnHQPreviewTitle}
                            onPress={() => this.switchHQPreview()}
                        />
                    </View>
                    <View style={styles.section}>
                        <Button
                            title={`${_('SETTINGS__INCLUDE_ICONS_IN_PROGRESS')}: ${this.state.includeIconsInProgress ? _('SETTINGS__IS_ON') : _('SETTINGS__IS_OFF')}`.toUpperCase()}
                            onPress={() => this.toggleIncludeIcons()}
                        />
                    </View>
                    {btnSync}
                    <View style={styles.section}>
                        <Button
                            title={_('BUTTON__CLEAR_DATA').toUpperCase()}
                            onPress={() => this.eraseData()}
                            color={CONFIG.COLORS.RED}
                        />
                    </View>
                </ScrollView>
                <View style={styles.bottom}/>

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

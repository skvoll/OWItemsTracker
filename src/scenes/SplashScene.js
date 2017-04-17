"use strict";

import React, {Component} from 'react';
import {
    AsyncStorage,
    StyleSheet,
    Image,
} from 'react-native';

import CONFIG from './../config';
import _ from './../i18n';
import Items from './../Items';
import {
    Layout,
} from './../components';
import Scene from './Scene';

export class SplashScene extends Scene {
    constructor(props, context, updater) {
        super(props, context, updater);
    }

    componentDidMount() {
        super.componentDidMount();

        CONFIG.initialize().then(() => {
            Items.initialize().then(async () => {
                const TIPS_SHOWN = await AsyncStorage.getItem('TIPS_SHOWN');

                if (TIPS_SHOWN !== 'true') {
                    await AsyncStorage.setItem('VERSION', CONFIG.VERSION);
                    await AsyncStorage.setItem('TIPS_SHOWN', 'true');

                    this.navigateTo('WelcomeScene', {type: 'tips',});

                    return;
                }

                if (CONFIG.SHOW_NEWS) {
                    const VERSION = await AsyncStorage.getItem('VERSION');

                    if (VERSION !== CONFIG.VERSION) {
                        await AsyncStorage.setItem('VERSION', CONFIG.VERSION);

                        if (VERSION) {
                            this.navigateTo('WelcomeScene');

                            return;
                        }
                    }
                }

                this.navigateTo('MainScene');
            });
        });
    }

    navigateTo(scene, props = {}) {
        if (!CONFIG.CLOUD_SYNCHRONIZATION && !__DEV__) {
            setTimeout(() => this.navigator.resetTo({name: scene, props: props,}), 1500);

            return;
        }

        this.navigator.resetTo({name: scene, props: props,});
    }

    render() {
        return (
            <Layout background={CONFIG.COLORS.DARK_BLUE} disablePadding={true} styles={styles.layout}>
                <Image source={require('./../assets/loader.gif')} style={styles.loader}/>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    layout: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        height: 96,
        width: 96,
        resizeMode: 'contain',
    },
});

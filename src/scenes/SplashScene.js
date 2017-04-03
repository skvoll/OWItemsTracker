"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
} from 'react-native';

import CONFIG from './../config';
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
            Items.initialize().then(() => {
                this.navigateToNext();
            });
        });
    }

    navigateToNext() {
        if (!CONFIG.CLOUD_SYNCHRONIZATION && !__DEV__) {
            setTimeout(() => this.navigator.resetTo({name: 'MainScene',}), 1500);

            return;
        }

        this.navigator.resetTo({name: 'MainScene',});
    }

    render() {
        return (
            <Layout styles={styles.layout}>
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

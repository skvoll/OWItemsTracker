"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
} from 'react-native';

export class Loader extends Component {
    static propTypes = {};

    static defaultProps = {};

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        return (
            <View style={styles.container}>
                <Image source={require('./../assets/loader.gif')} style={styles.loader}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        height: 64,
        width: 64,
    },
});

"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';

export class RemainingAmount extends Component {
    static propTypes = {
        amount: React.PropTypes.oneOfType([
            React.PropTypes.number,
            React.PropTypes.string,
        ]).isRequired,
    };

    static defaultProps = {};

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.amount.toString()}</Text>
                <Image source={require('./../assets/credit.png')} style={styles.icon}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 56,
        marginHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        marginHorizontal: 8,
        fontFamily: 'BigNoodleToo',
        color: '#FFFFFF',
    },
    icon: {
        height: 32,
        width: 32,
    },
});

"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CONFIG from './../config';
import {
    Touchable,
} from './';

export class Button extends Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        onPress: React.PropTypes.func.isRequired,
        icon: React.PropTypes.string,
        color: React.PropTypes.string,
        textColor: React.PropTypes.string,
        style: View.propTypes.style,
    };

    static defaultProps = {
        color: CONFIG.COLORS.LIGHT_BLUE,
        textColor: '#FFFFFF',
    };

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        let style = {backgroundColor: this.props.color,}, icon;

        if (this.props.icon) {
            style.justifyContent = 'center';
            icon = (<Icon name={this.props.icon} size={24} color={this.props.textColor}/>);
        }

        return (
            <Touchable onPress={this.props.onPress}>
                <View style={[styles.button, this.props.style, style,]}>
                    {icon}
                    <Text
                        numberOfLines={1}
                        style={[styles.title, {color: this.props.textColor,},]}
                    >

                        {this.props.title}

                    </Text>
                </View>
            </Touchable>
        );
    };
}

const styles = StyleSheet.create({
    button: {
        height: 48,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 4,
    },
    title: {
        paddingHorizontal: 8,
        fontSize: 24,
        fontFamily: 'BigNoodleToo',
    },
    icon: {
        height: 24,
        width: 24,
        paddingHorizontal: 8,
    },
});

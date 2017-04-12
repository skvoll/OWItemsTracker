"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Picker,
    Text,
} from 'react-native';

import CONFIG from './../config';
import {Button} from './Button';

export class ButtonPicker extends Button {
    static propTypes = {
        values: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
        selectedValue: React.PropTypes.any.isRequired,
        onValueChange: React.PropTypes.func.isRequired,
        title: React.PropTypes.string,
        color: React.PropTypes.string,
        textColor: React.PropTypes.string,
    };

    static defaultProps = {
        color: CONFIG.COLORS.LIGHT_BLUE,
        textColor: '#FFFFFF',
    };

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        let values = [], style, itemStyle;

        if (CONFIG.PLATFORM === 'ios') {
            itemStyle = {color: this.props.textColor,};
        } else {
            style = {color: this.props.textColor,};
        }

        this.props.values.map((item) => {
            values.push(<Picker.Item key={`${item.label}_${item.value}`} label={item.label} value={item.value}/>);
        });

        return (
            <View style={[styles.button, {backgroundColor: this.props.color,},]}>
                <Text
                    numberOfLines={1}
                    style={[styles.title, {color: this.props.textColor,},]}
                >

                    {`${this.props.title}:`}

                </Text>
                <Picker
                    selectedValue={this.props.selectedValue}
                    onValueChange={(value) => this.props.onValueChange(value)}
                    style={[styles.picker, style,]}
                    itemStyle={itemStyle}
                >

                    {values}

                </Picker>
            </View>
        );
    };
}

const styles = StyleSheet.create({
    button: {
        height: CONFIG.PLATFORM === 'ios' ? 48 * 2 : 48,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        overflow: 'hidden',
    },
    title: {
        paddingHorizontal: 8,
        fontSize: 22,
        fontFamily: 'BigNoodleToo',
    },
    picker: {
        flex: 1,
    },
});

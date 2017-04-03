"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';

import CONFIG from './../config';

export class ButtonsGroup extends Component {
    static propTypes = {
        items: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    };

    static defaultProps = {};

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            items: [],
            active: 0,
        };
    }

    componentWillMount() {
        this.prepareState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.prepareState(nextProps);
    }

    prepareState(props) {
        let state = {
            items: props.items,
        };

        props.items.map((item, index) => {
            if (item.isActive) {
                state.active = index;
            }
        });

        this.setState(state);
    }

    onPress(index, callback) {
        this.setState({
            active: index,
        }, callback);
    }

    render() {
        let buttons = [];

        this.state.items.map((item, index) => {
            buttons.push((
                <TouchableWithoutFeedback
                    key={index}
                    onPress={() => this.onPress(index, item.action)}
                >

                    <View
                        style={[styles.button, (index === this.state.active ? styles.buttonActive : null),]}
                    >

                        <Text
                            style={[styles.buttonTitle, (index === this.state.active ? styles.buttonTitleActive : null),]}
                        >

                            {item.title.toUpperCase()}

                        </Text>

                    </View>

                </TouchableWithoutFeedback>
            ));
        });

        return (
            <View style={styles.container}>
                {buttons}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: CONFIG.COLORS.LIGHT_BLUE,
        backgroundColor: CONFIG.COLORS.DARK_BLUE,
    },
    button: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 4,
    },
    buttonActive: {
        backgroundColor: CONFIG.COLORS.LIGHT_BLUE,
    },
    buttonTitle: {
        fontFamily: 'Futura',
        color: CONFIG.COLORS.LIGHT_BLUE,
    },
    buttonTitleActive: {
        color: '#FFFFFF',
    },
});

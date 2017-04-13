"use strict";

import React, {Component} from 'react';
import {
    Vibration,
    StyleSheet,
    Modal,
    View,
    Text,
} from 'react-native';

import CONFIG from './../config';
import _ from './../l10n';
import {
    Button,
} from './';

export class SimpleModal extends Modal {
    static propTypes = {
        children: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element),
        ]),
        isVisible: React.PropTypes.bool,
        title: React.PropTypes.string,
        actions: React.PropTypes.arrayOf(React.PropTypes.object),
        vibration: React.PropTypes.number,
    };

    static defaultProps = {
        isVisible: false,
        title: '',
        vibration: 20,
    };

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            isVisible: this.props.isVisible,
            title: this.props.title,
            actions: this.props.actions,
        };
    }

    vibrate() {
        if (this.props.vibration && !this.state.isVisible) {
            Vibration.vibrate(this.props.vibration);
        }
    }

    close() {
        this.setState({
            isVisible: false,
        });
    }

    open(title = null) {
        this.vibrate();

        this.setState({
            isVisible: true,
            title: title || this.state.title,
        });
    }

    renderContent() {
        return this.props.children;
    }

    render() {
        let title, actions = [];

        if (this.state.title) {
            title = (<Text numberOfLines={1} style={styles.title}>{this.state.title.toUpperCase()}</Text>);
        }

        if (this.state.actions) {
            this.state.actions.map((item, index) => {
                actions.push(
                    <Button
                        key={`modal-action-${index}`}
                        title={item.title}
                        icon={item.icon || null}
                        onPress={item.action}
                        style={styles.action}
                    />
                );
            });
        } else {
            actions.push(
                <Button
                    key={`modal-action-close`}
                    title={_('BUTTON__CLOSE')}
                    icon="close"
                    onPress={() => this.close()}
                    style={styles.action}
                />
            );
        }

        return (
            <Modal
                animationType="slide"
                onRequestClose={() => this.close()}
                transparent={true}
                visible={this.state.isVisible}
            >

                <View style={styles.container}>
                    {title}
                    {this.renderContent()}
                    <View style={styles.actions}>
                        {actions}
                    </View>
                </View>

            </Modal>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CONFIG.COLORS.DARK_BLUE,
    },
    title: {
        margin: 8,
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'BigNoodleToo',
        color: CONFIG.COLORS.COMMON,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    action: {
        marginVertical: 8,
        marginRight: 8,
    },
});

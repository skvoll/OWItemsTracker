"use strict";

import React, {Component} from 'react';
import {
    Vibration,
    StyleSheet,
    Modal,
    View,
    Image,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CONFIG from './../config';
import {
    Touchable,
} from './';

export class ModalPreview extends Modal {
    static propTypes = {
        visible: React.PropTypes.bool,
    };

    static defaultProps = {
        visible: false,
    };

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            visible: this.props.visible,
            title: null,
            placeholder: null,
            source: null,
        };
    }

    setTitle(title) {
        this.setState({
            title: title,
        });
    }

    setPlaceholder(placeholder) {
        this.setState({
            placeholder: placeholder,
            source: null,
        });
    }

    setSource(source) {
        this.setState({
            placeholder: null,
            source: source,
        });
    }

    close() {
        this.setState({
            visible: !this.state.visible,
            title: null,
            placeholder: null,
            source: null,
        });
    }

    show(title = null, placeholder = null, source = null) {
        Vibration.vibrate(20);
        this.setState({
            visible: true,
            title: title,
            placeholder: placeholder,
            source: source,
        });
    }

    render() {
        let title, content;

        if (this.state.title) {
            title = this.state.title.toUpperCase();
        }

        if (this.state.source) {
            content = (
                <Image
                    source={this.state.source}
                    style={styles.image}
                />
            );
        } else if (this.state.placeholder) {
            content = (
                <View style={styles.placeholder}>
                    <Text style={styles.placeholderTitle}>
                        {this.state.placeholder.toUpperCase()}
                    </Text>
                </View>
            );
        }

        return (
            <Modal
                animationType="slide"
                onRequestClose={() => this.close()}
                transparent={true}
                visible={this.state.visible}
            >

                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <Touchable onPress={() => this.close()}>
                            <View>
                                <Icon name="close" size={48} color="#FFFFFF"/>
                            </View>
                        </Touchable>
                    </View>
                    {content}
                </View>

            </Modal>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: CONFIG.COLORS.DARK_BLUE,
    },
    header: {
        minHeight: 48,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 21,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.COMMON,
    },
    placeholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderTitle: {
        fontSize: 21,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.COMMON,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

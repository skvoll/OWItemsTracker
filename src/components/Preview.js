"use strict";

import React, {Component} from 'react';
import {
    Platform,
    Vibration,
    StyleSheet,
    Modal,
    View,
    Image,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CONFIG from './../config';
import _ from './../i18n';
import {
    Loader,
    Button,
} from './';

export class Preview extends Component {
    static propTypes = {
        isVisible: React.PropTypes.bool,
        vibration: React.PropTypes.number,
    };

    static defaultProps = {
        isVisible: false,
        vibration: 20,
    };

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            isVisible: this.props.isVisible,
            title: '',
            source: null,
            isLoaded: false,
            error: false,
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
            title: '',
            source: null,
            isLoaded: false,
            error: false,
        });
    }

    open(title, source) {
        this.vibrate();

        this.setState({
            isVisible: true,
            title: title || '',
            source: source,
            error: false,
        });
    }

    error(title, error) {
        this.vibrate();

        this.setState({
            isVisible: true,
            title: title || '',
            source: null,
            error: error,
        });
    }

    render() {
        let placeholder;

        if (this.state.error) {
            placeholder = (
                <View style={styles.content}>
                    <Icon name="error-outline" style={styles.errorIcon} />
                    <Text style={styles.errorText}>{this.state.error.toUpperCase()}</Text>
                </View>
            );
        } else if (!this.state.isLoaded) {
            placeholder = (<Loader/>);
        }

        return (
            <Modal
                animationType="slide"
                onRequestClose={() => this.close()}
                transparent={true}
                visible={this.state.isVisible}
            >

                <View style={styles.container}>
                    <Text numberOfLines={1} style={styles.title}>{this.state.title.toUpperCase()}</Text>
                    <View style={styles.content}>
                        <Image
                            source={this.state.source}
                            onLoad={() => this.setState({isLoaded: true,})}
                            onerror={() => this.setState({error: _('ERROR__PREVIEW_NOT_FOUND'),})}
                            style={[styles.preview, (this.state.isLoaded ? null : styles.previewHidden)]}
                        />

                        {placeholder}
                    </View>
                    <Button
                        title={_('BUTTON__CLOSE')}
                        icon="close"
                        onPress={() => this.close()}
                        style={styles.close}
                    />
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
        ...Platform.select({
            'ios': {
                marginTop: 24,
            },
        }),
    },
    close: {
        margin: 8,
    },
    content: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
    },
    preview: {
        flex: 1,
        resizeMode: 'contain',
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewHidden: {
        flex: 0,
        width: 1,
        height: 1,
    },
    errorIcon: {
        alignSelf: 'center',
        fontSize: 184,
        color: CONFIG.COLORS.COMMON,
    },
    errorText: {
        textAlign: 'center',
        fontSize: 32,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.COMMON,
    },
});

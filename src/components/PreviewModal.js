"use strict";

import React, {Component} from 'react';
import {
    Vibration,
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CONFIG from './../config';
import _ from './../l10n';
import {
    Loader,
} from './';
import {SimpleModal} from './SimpleModal';

export class PreviewModal extends SimpleModal {
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
            title: null,
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
            title: null,
            source: null,
            isLoaded: false,
            error: false,
        });
    }

    open(title, source) {
        this.vibrate();

        this.setState({
            isVisible: true,
            title: title,
            source: source,
            error: false,
        });
    }

    error(title, error) {
        this.vibrate();

        this.setState({
            isVisible: true,
            title: title,
            source: null,
            error: error,
        });
    }

    renderContent() {
        let placeholder;

        if (this.state.error) {
            return (
                <View style={styles.container}>
                    <Icon name="error-outline" style={styles.errorIcon} />
                    <Text style={styles.errorText}>{this.state.error.toUpperCase()}</Text>
                </View>
            );
        } else if (!this.state.isLoaded) {
            placeholder = (<Loader/>);
        }

        return (
            <View style={styles.container}>
                <Image
                    source={this.state.source}
                    onLoad={() => this.setState({isLoaded: true,})}
                    onerror={() => this.setState({error: _('ERROR__PREVIEW_NOT_FOUND'),})}
                    style={[styles.preview, (this.state.isLoaded ? null : styles.previewHidden)]}
                />

                {placeholder}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
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
        display: 'none',
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

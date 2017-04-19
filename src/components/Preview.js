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
import CloudStorage from './../CloudStorage';
import {
    Button,
} from './';

export class Preview extends Component {
    static propTypes = {
        vibration: React.PropTypes.number,
    };

    static defaultProps = {
        vibration: 20,
    };

    static initialState = {
        isVisible: false,
        title: '',
        thumbnail: null,
        source: null,
        isLoaded: false,
        messageText: null,
        messageIcon: null,
    };

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = Preview.initialState;
    }

    vibrate() {
        if (this.props.vibration && !this.state.isVisible) {
            Vibration.vibrate(this.props.vibration);
        }
    }

    close() {
        this.setState(Preview.initialState);
    }

    show(title, source = null, cloudPath = null) {
        this.vibrate();

        if (cloudPath) {
            this.setState({
                isVisible: true,
                title: title,
                thumbnail: source,
            });

            if (CONFIG.HQ_PREVIEW === false) {
                this.message(_('PREVIEW__HQ_PREVIEW_DISABLED'), 'info');

                return;
            } else if (CONFIG.HQ_PREVIEW === 'WIFI' && CONFIG.NETWORK !== 'WIFI') {
                this.message(_('PREVIEW__HQ_PREVIEW_AVAILABLE_ONLY_VIA_WIFI'), 'signal-wifi-off');

                return;
            } else if (CONFIG.HQ_PREVIEW === true && CONFIG.NETWORK === 'NONE') {
                this.message(_('ERROR__NO_INTERNET_CONNECTION'), 'error-outline');

                return;
            }

            CloudStorage.getFileUrl(cloudPath)
                .then((url) => this.setState({source: {uri: url,}}))
                .catch((error) => this.message(_('PREVIEW__HQ_PREVIEW_NOT_FOUND'), 'error-outline'));
        } else {
            this.setState({
                isVisible: true,
                title: title,
                source: source,
            });
        }
    }

    message(message, icon = null) {
        this.setState({
            messageText: message,
            messageIcon: icon,
        });
    }

    showItem(item) {
        this.show(_(item.uid), item.thumbnail, item.preview);
    }

    showHero(hero) {
        this.show(_(hero.code), hero.background);
    }

    render() {
        let message;

        if (this.state.messageText) {
            message = (
                <View style={styles.message}>
                    {this.state.messageIcon && <Icon name={this.state.messageIcon} style={styles.messageIcon}/>}
                    <Text numberOfLines={1} style={styles.messageText}>{this.state.messageText.toUpperCase()}</Text>
                </View>
            );
        } else if (!this.state.isLoaded) {
            message = (
                <View style={styles.message}>
                    <Image source={require('./../assets/loader.gif')} style={styles.messageLoader}/>
                </View>
            );
        } else {
            message = (<View style={styles.message}/>);
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
                            source={this.state.thumbnail}
                            style={[styles.image, (this.state.isLoaded ? styles.imageHidden : null),]}
                        />
                        <Image
                            source={this.state.source}
                            onLoad={() => this.setState({isLoaded: true,})}
                            onerror={() => this.message(_('PREVIEW__HQ_PREVIEW_NOT_FOUND'), 'error-outline')}
                            style={[styles.image, (this.state.isLoaded ? null : styles.imageHidden),]}
                        />
                    </View>
                    {message}
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
    content: {
        flex: 1,
        padding: 8,
        justifyContent: 'center',
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
        width: null,
        height: null,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageHidden: {
        ...Platform.select({
            'ios': {
                flex: 0,
                width: 1,
                height: 1,
            },
            'android': {
                display: 'none',
            },
        }),
    },
    message: {
        height: 24,
        margin: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageLoader: {
        height: 12,
        width: 12,
    },
    messageIcon: {
        alignSelf: 'center',
        fontSize: 14,
        color: CONFIG.COLORS.COMMON,
    },
    messageText: {
        flex: 1,
        marginHorizontal: 8,
        fontSize: 14,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.COMMON,
    },
    close: {
        margin: 8,
    },
});

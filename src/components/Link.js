"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconSocial from 'react-native-vector-icons/FontAwesome';
import {ANIMATIONS_SLIDE, CustomTabs} from 'react-native-custom-tabs';

import CONFIG from './../config';
import {
    Touchable,
} from './';

export class Link extends Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        href: React.PropTypes.string,
        icon: React.PropTypes.string,
        backgroundColor: React.PropTypes.string,
        textColor: React.PropTypes.string,
        style: View.propTypes.style,
    };

    static defaultProps = {
        backgroundColor: CONFIG.COLORS.DARK_BLUE_OPACITY,
        textColor: CONFIG.COLORS.COMMON,
    };

    onPress() {
        // Linking.openURL(this.props.href);
        CustomTabs.openURL(this.props.href, {
            toolbarColor: '#27344D',
            showPageTitle: true,
            enableDefaultShare: true,
            animations: ANIMATIONS_SLIDE,
        }).then((launched) => {
            console.log(`Launched custom tabs: ${launched}`);
        }).catch(err => {
            console.error(err);
        });
    }

    render() {
        let content, style = {
            backgroundColor: this.props.backgroundColor,
            textColor: this.props.textColor,
        }, icon;

        if (this.props.icon) {
            icon = (
                <IconSocial
                    name={this.props.icon}
                    size={24}
                    color={style.textColor}
                />
            );
        }

        content = (
            <View style={[styles.container, this.props.style, {backgroundColor: style.backgroundColor,},]}>
                {icon}
                <Text style={[styles.title, {color: style.textColor,},]}>{this.props.title}</Text>
                {this.props.href && (
                    <Icon
                        name="open-in-browser"
                        size={24}
                        color={style.textColor}
                    />)}
            </View>
        );

        if (this.props.href) {
            content = (
                <Touchable onPress={() => this.onPress()}>
                    {content}
                </Touchable>
            );
        }

        return content;
    }
}

const styles = StyleSheet.create({
    container: {
        height: 48,
        marginVertical: 2,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CONFIG.COLORS.DARK_BLUE_OPACITY,
    },
    title: {
        flex: 1,
        marginHorizontal: 8,
        fontSize: 18,
        fontFamily: 'Futura',
        color: '#F5F5F5',
    },
});

"use strict";

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Image,
    View,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CONFIG from './../config';

export class Layout extends Component {
    static propTypes = {
        children: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element),
        ]).isRequired,
        toolbarTitle: React.PropTypes.string,
        onToolbarIconPress: React.PropTypes.func,
        toolbarActions: Icon.ToolbarAndroid.propTypes.actions,
        onToolbarActionSelected: React.PropTypes.func,
        background: React.PropTypes.oneOfType([
            Image.propTypes.source,
            React.PropTypes.string,
        ]),
        disablePadding: React.PropTypes.bool,
        styles: Image.propTypes.style,
    };

    static defaultProps = {
        toolbarTitle: null,
        background: require('./../assets/background.jpg'),
        disablePadding: false,
    };

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        let toolbar, tbBack, tbActions = [];

        if (this.props.toolbarTitle) {
            if (CONFIG.PLATFORM === 'android') {
                toolbar = (
                    <Icon.ToolbarAndroid
                        navIconName={this.props.onToolbarIconPress && 'arrow-back'}
                        iconColor="#FFFFFF"
                        onIconClicked={this.props.onToolbarIconPress}
                        actions={this.props.toolbarActions}
                        onActionSelected={this.props.onToolbarActionSelected}
                        overflowIconName="more-vert"
                        style={styles.toolbar}
                    >

                        <Text style={styles.toolbarTitle}>{this.props.toolbarTitle.toUpperCase()}</Text>

                    </Icon.ToolbarAndroid>
                );
            } else {
                if (this.props.onToolbarIconPress) {
                    tbBack = (
                        <TouchableWithoutFeedback
                            onPress={this.props.onToolbarIconPress}
                        >

                            <Icon
                                name="arrow-back"
                                size={24}
                                style={styles.mpToolbarBack}
                            />

                        </TouchableWithoutFeedback>
                    );
                }

                if (this.props.toolbarActions) {
                    this.props.toolbarActions.map((action, index) => {
                        tbActions.push(
                            <TouchableWithoutFeedback
                                key={`toolbar-action-icon-${index}`}
                                onPress={() => this.props.onToolbarActionSelected(index)}
                            >

                                <Icon
                                    name={action.iconName}
                                    size={24}
                                    style={styles.mpToolbarAction}
                                />

                            </TouchableWithoutFeedback>
                        );
                    });
                }

                toolbar = (
                    <View style={styles.mpToolbar}>
                        {tbBack}
                        <Text style={styles.mpToolbarTitle}>{this.props.toolbarTitle.toUpperCase()}</Text>
                        {tbActions}
                    </View>
                );
            }
        }

        let style = [styles.container,];

        if (!this.props.disablePadding) {
            style.push(styles.containerPadding);
        }

        if (typeof this.props.background === 'string') {
            style.push({backgroundColor: this.props.background,});

            if (this.props.styles) {
                style.push(this.props.styles);
            }

            return (
                <View style={style}>
                    {toolbar}
                    {this.props.children}
                </View>
            );
        } else {
            style.push(styles.containerImage);

            if (this.props.styles) {
                style.push(this.props.styles);
            }

            return (
                <Image
                    source={this.props.background}
                    style={style}
                >

                    {toolbar}
                    {this.props.children}

                </Image>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerPadding: {
        ...Platform.select({
            ios: {
                paddingTop: 24,
            },
            android: {
                paddingTop: Platform.Version < 21 ? 0 : 24,
            },
        }),
    },
    containerImage: {
        resizeMode: 'cover',
        width: null,
        height: null,
    },
    toolbar: {
        height: 56,
    },
    toolbarTitle: {
        fontSize: 20,
        fontFamily: 'Futura',
        color: '#FFFFFF',
    },
    mpToolbar: {
        height: 56,
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    mpToolbarBack: {
        marginRight: 16,
        color: '#FFFFFF',
    },
    mpToolbarTitle: {
        flex: 1,
        fontSize: 20,
        fontFamily: 'Futura',
        color: '#FFFFFF',
    },
    mpToolbarAction: {
        marginLeft: 16,
        color: '#FFFFFF',
    },
});

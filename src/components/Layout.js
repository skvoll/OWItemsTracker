"use strict";

import React, {Component} from 'react';
import {
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
        background: Image.propTypes.source,
        styles: Image.propTypes.style,
    };

    static defaultProps = {
        toolbarTitle: null,
        background: require('./../assets/background.jpg'),
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

        return (
            <Image source={this.props.background} style={[styles.container, this.props.styles,]}>
                {toolbar}
                {this.props.children}
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 24,
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

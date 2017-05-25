"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {
    TabNavigator,
} from 'react-navigation';

import CONFIG from './../config';
import _ from './../i18n';
import {
    ButtonsGroup,
} from './../components';

class TabBarTop extends Component {
    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        let actions = [];
        this.props.navigationState.routes.map((item, index) => {
            actions.push({
                title: _(item.routeName, item.routeName), action: () => {
                    this.props.jumpToIndex(index);
                },
                isActive: this.props.navigationState.index === index,
            });
        });

        return (
            <View style={styles.tabBarTop}>
                <ButtonsGroup items={actions}/>
            </View>
        );
    }
}

class TabBarPager extends Component {
    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        let items = [];

        if (this.props.navigationState.routes.length > 1) {
            this.props.navigationState.routes.map((item, index) => {
                items.push(
                    <View
                        key={index}
                        style={[
                            styles.tabBarPagerItem,
                            (this.props.navigationState.index === index ? styles.tabBarPagerItemActive : null)
                        ]}
                    />
                );
            });

            return (
                <View style={styles.tabBarPager}>
                    {items}
                </View>
            );
        }

        return (<View/>);
    }
}

export class Tabs extends Component {
    static propTypes = {
        items: React.PropTypes.arrayOf(
            React.PropTypes.func
        ).isRequired,
        screenProps: React.PropTypes.object,
        tabBar: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.oneOf(['tabs', 'pager',]),
        ]),
        tabBarPosition: React.PropTypes.oneOf(['top', 'bottom',]),
    };

    static defaultProps = {
        screenProps: {},
        tabBar: 'tabs',
        tabBarPosition: 'top',
    };

    constructor(props, context, updater) {
        super(props, context, updater);

        let tabBar = TabBarTop, tabBarPosition = this.props.tabBarPosition;

        if (typeof this.props.tabBar === 'function') {
            tabBar = this.props.tabBar;
        } else if (this.props.tabBar === 'pager') {
            tabBar = TabBarPager;
            tabBarPosition = 'bottom';
        }

        this.state = {
            tabs: null,
            tabBar: tabBar,
            tabBarPosition: tabBarPosition,
        };
    }

    componentWillMount() {
        this.prepareTabs();
    }

    prepareTabs() {
        let tabs = {};

        this.props.items.map(item => {
            tabs[item.navigationOptions.tabBarLabel] = {screen: item,};
        });

        this.setState({
            tabs: TabNavigator(tabs, {
                backBehavior: 'none',
                tabBarComponent: this.state.tabBar,
                tabBarPosition: this.state.tabBarPosition,
            }),
        });
    }

    render() {
        return (
            <this.state.tabs
                screenProps={this.props.screenProps}
                onNavigationStateChange={null}
            />
        );
    };
}

const styles = StyleSheet.create({
    tabBarTop: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarPager: {
        height: 48,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarPagerItem: {
        height: 8,
        width: 8,
        marginHorizontal: 4,
        borderRadius: 4,
        backgroundColor: CONFIG.COLORS.LIGHT_BLUE,
    },
    tabBarPagerItemActive: {
        height: 12,
        width: 12,
        borderRadius: 6,
    },
});

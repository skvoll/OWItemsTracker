"use strict";

import React, {Component} from 'react';
import {
    Navigator,
    StyleSheet,
    StatusBar,
    View,
} from 'react-native';

import * as scenes from './scenes';

export default class Application extends Component {
    static propTypes = {};

    static defaultProps = {};

    navigator = null;

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            currentScene: 'MainScene',
        };
    }

    renderScene(route, navigator) {
        if (scenes[route.name]) {
            route.component = scenes[route.name];

            return (
                <route.component application={this} navigator={navigator} {...route.props}/>
            );
        }

        console.error(`scene ${route.name} was not found`);
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />

                <Navigator
                    ref={(component) => this.navigator = component}
                    initialRoute={{name: 'SplashScene',}}
                    renderScene={(route, navigator) => this.renderScene(route, navigator)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

"use strict";

import React, {Component} from 'react';
import {
    BackAndroid,
} from 'react-native';

export default class Scene extends Component {
    static propTypes = {
        application: React.PropTypes.object.isRequired,
        navigator: React.PropTypes.object.isRequired,
    };

    static defaultProps = {};

    application;
    navigator;
    hardwareBackPress = null;

    constructor(props, context, updater) {
        super(props, context, updater);

        if (this.props.application) {
            this.application = this.props.application;
        }
        if (this.props.navigator) {
            this.navigator = this.props.navigator;
        }
    }

    componentDidMount() {
        if (typeof this.hardwareBackPress === 'function') {
            BackAndroid.addEventListener('hardwareBackPress', this.hardwareBackPress);
        }
    }

    componentWillUnmount() {
        if (typeof this.hardwareBackPress === 'function') {
            BackAndroid.removeEventListener('hardwareBackPress', this.hardwareBackPress);
        }
    }

    navigationPop() {
        let currentRoutes = this.navigator.getCurrentRoutes();

        if (currentRoutes.length > 1) {
            this.navigator.pop();

            return true;
        }

        return false;
    }
}

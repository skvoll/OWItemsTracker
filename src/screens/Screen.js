"use strict";

import React, {Component} from 'react';

export default class Screen extends Component {
    static propTypes = {
        screenProps: React.PropTypes.object.isRequired,
        navigation: React.PropTypes.object.isRequired,
    };

    static defaultProps = {};

    application;

    constructor(props, context, updater) {
        super(props, context, updater);

        this.application = props.screenProps.application;
    }
}

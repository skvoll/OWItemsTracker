"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    ScrollView,
} from 'react-native';

import Items from './../Items';
import {
    Button,
} from './';

export class ItemTypesList extends Component {
    static propTypes = {
        onItemPress: React.PropTypes.func.isRequired,
        style: ScrollView.propTypes.style,
        contentContainerStyle: ScrollView.propTypes.contentContainerStyle,
    };

    static defaultProps = {};

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            items: [],
        };
    }

    componentWillMount() {
        let item, items = [];

        for (let i in Items.TYPE) if (Items.TYPE.hasOwnProperty(i)) {
            item = Items.TYPE[i];
            items.push(
                <Button
                    key={i}
                    item={item}
                    title={`${Items.TYPE_LABEL[item]}`}
                    icon="keyboard-arrow-right"
                    onPress={this.props.onItemPress}
                />
            );
        }

        this.setState({
            items: items.reverse(),
        });
    }

    render() {
        return (
            <ScrollView
                style={[styles.container, this.props.style,]}
                contentContainerStyle={[styles.contentContainerStyle, this.props.contentContainerStyle,]}
            >

                {this.state.items}

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
    contentContainerStyle: {
        padding: 8,
    },
});

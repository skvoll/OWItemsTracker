"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';

import CONFIG from './../config';
import Items from './../Items';

export class ItemsProgress extends Component {
    static propTypes = {
        type: React.PropTypes.number,
        rarity: React.PropTypes.number,
        hero: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.bool,
        ]),
        event: React.PropTypes.oneOfType([
            React.PropTypes.object,
            React.PropTypes.bool,
        ]),
        showProgress: React.PropTypes.bool,
        showAmount: React.PropTypes.bool,
    };

    static defaultProps = {
        showProgress: true,
        showAmount: true,
    };

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            progress: null,
            amount: null,
        };
    }

    componentWillMount() {
        this.setData();
    }

    componentWillReceiveProps() {
        this.setData();
    }

    setData() {
        let progress, amount;

        progress = Items.getProgress(
            null,
            this.props.type,
            this.props.rarity,
            this.props.hero && (this.props.hero === true ? true : this.props.hero.id),
            this.props.event && (this.props.event === true ? true : this.props.event.id)
        );

        amount = Items.getRemainingAmount(
            null,
            this.props.type,
            this.props.rarity,
            this.props.hero && (this.props.hero === true ? true : this.props.hero.id),
            this.props.event && (this.props.event === true ? true : this.props.event.id)
        );

        this.setState({
            progress: progress,
            amount: amount,
        });
    }

    render() {
        let progress = (<View/>), amount = (<View/>);

        if (this.props.showProgress && this.state.progress !== null) {
            progress = (
                <View style={styles.progress}>
                    <Text style={styles.progressTitle}>
                        {`${this.state.progress.received}/${this.state.progress.total}`}
                    </Text>
                </View>
            );
        }

        if (this.props.showAmount && this.state.amount !== null) {
            amount = (
                <View style={styles.amount}>
                    <Text style={styles.amountTitle}>{this.state.amount}</Text>
                    <Image source={require('./../assets/credit.png')} style={styles.amountIcon}/>
                </View>
            );
        }

        return (
            <View style={styles.container}>
                {progress}
                {amount}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: 56,
        marginHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progress: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    progressTitle: {
        fontSize: 28,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.LIGHT_BLUE,
    },
    amount: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    amountTitle: {
        fontSize: 32,
        marginHorizontal: 8,
        fontFamily: 'BigNoodleToo',
        color: CONFIG.COLORS.COMMON,
    },
    amountIcon: {
        height: 32,
        width: 32,
    },
});

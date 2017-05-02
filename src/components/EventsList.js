"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Image,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CONFIG from './../config';
import _ from './../i18n';
import Events from './../Events';
import Items from './../Items';
import {
    Touchable,
    ItemsProgress,
} from './';

class Item extends Component {
    static propTypes = {
        index: React.PropTypes.number.isRequired,
        item: React.PropTypes.object.isRequired,
        onPress: React.PropTypes.func.isRequired,
        onLongPress: React.PropTypes.func,
    };

    static defaultProps = {
        onLongPress: () => null,
    };

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        let progress;

        if (this.props.item.progress) {
            progress = (
                <Text numberOfLines={1} style={styles.progress}>
                    {`${this.props.item.progress.received}/${this.props.item.progress.total}`}
                </Text>
            );
        }

        return (
            <Touchable
                onPress={() => this.props.onPress(this.props.item, this.props.index)}
                onLongPress={() => this.props.onLongPress(this.props.item, this.props.index)}
            >

                <View style={styles.item}>
                    <Image source={this.props.item.icon} style={styles.icon}/>
                    <Text numberOfLines={1} style={styles.name}>
                        {this.props.item.name}
                    </Text>
                    {progress}
                    <Icon
                        name="keyboard-arrow-right"
                        color="#FFFFFF"
                        size={24}
                    />
                </View>

            </Touchable>
        );
    }
}

export class EventsList extends Component {
    static propTypes = {
        onItemPress: React.PropTypes.func.isRequired,
        onItemLongPress: React.PropTypes.func,
        showProgress: React.PropTypes.bool,
    };

    static defaultProps = {
        showProgress: true,
    };

    isShouldComponentUpdate = false;

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            data: [],
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.isShouldComponentUpdate) {
            this.isShouldComponentUpdate = false;

            return true;
        }

        return false;
    }

    componentWillMount() {
        this.loadItems();
    }

    componentWillReceiveProps(nextProps) {
        let progress;

        if (this.props.showProgress) {
            progress = Items.getProgressByEvents();
        }

        for (let i in this.state.data) if (this.state.data.hasOwnProperty(i)) {
            if (progress) {
                if (
                    this.state.data[i].progress
                    && this.state.data[i].progress.received !== progress[this.state.data[i].id].received
                ) {
                    this.loadItems();

                    return;
                }
            }

            if (this.state.data[i].name !== _(this.state.data[i].code)) {
                this.loadItems();

                return;
            }
        }
    }

    loadItems() {
        let data = [], progress;

        Object.values(Events.ITEMS).map(item => {
            data.push(Object.assign({}, item));
        });

        if (this.props.showProgress) {
            progress = Items.getProgressByEvents();
        }

        data.map(item => {
            item.name = _(item.code);
            if (progress[item.id]) {
                item.progress = progress[item.id];
            }
        });

        data.reverse();

        this.isShouldComponentUpdate = true;

        this.setState({
            data: data,
        });
    }

    renderItem(item, index) {
        return (
            <Item
                index={index}
                item={item}
                onPress={this.props.onItemPress}
                onLongPress={this.props.onItemLongPress}
            />
        );
    }

    shouldItemUpdate(prev, next) {
        if (this.props.showProgress) {
            if (prev.item.progress && next.item.progress) {
                if (prev.item.progress.received !== next.item.progress.received) {
                    return true;
                }
            }
        }

        return prev.item.name !== next.item.name;
    }

    render() {
        return (
            <View style={styles.container}>
                <ItemsProgress event={true}/>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    shouldItemUpdate={(prev, next) => this.shouldItemUpdate(prev, next)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        height: 56,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CONFIG.COLORS.LIGHT_BLUE_OPACITY,
    },
    icon: {
        margin: 8,
        height: 24,
        width: 24,
    },
    name: {
        fontSize: 24,
        fontFamily: 'BigNoodleToo',
        color: '#FFFFFF',
    },
    progress: {
        flex: 1,
        margin: 8,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.DARK_BLUE,
    },
});

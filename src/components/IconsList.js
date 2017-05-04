"use strict";

import React, {Component} from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    FlatList,
    TouchableWithoutFeedback,
    Image,
    Text,
} from 'react-native';

import CONFIG from './../config';
import _ from './../i18n';
import Items from './../Items';
import Events from './../Events';
import Heroes from './../Heroes';
import {
    Preview,
    ItemsProgress,
} from './';

const GRID_SIZE = 4;

class Item extends Component {
    static propTypes = {
        index: React.PropTypes.number.isRequired,
        item: React.PropTypes.object.isRequired,
        onPress: React.PropTypes.func.isRequired,
        onLongPress: React.PropTypes.func.isRequired,
        addHeroIcon: React.PropTypes.bool,
        addEventIcon: React.PropTypes.bool,
    };

    static defaultProps = {
        addHeroIcon: true,
        addEventIcon: false,
    };

    SIZE;

    onDimensionsChangedHandler = event => this.onDimensionsChanged(event);

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.item.received !== nextProps.item.received) {
            return true;
        }

        return false;
    }

    componentWillMount() {
        this.setSize(Dimensions.get('window').width);

        Dimensions.addEventListener('change', this.onDimensionsChangedHandler);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.onDimensionsChangedHandler);
    }

    onDimensionsChanged(event) {
        this.setSize(event.window.width);

        this.forceUpdate();
    }

    setSize(width) {
        this.SIZE = (width * ((100 / (GRID_SIZE + 1) / 100)));
    }

    render() {
        let size = {height: this.SIZE, width: this.SIZE,}, style = null, heroIcon, eventIcon, price;

        if (!this.props.item.default && !this.props.item.received) {
            style = styles.iconOpacity;
        }

        if (this.props.addHeroIcon && this.props.item.hero) {
            heroIcon = (
                <Image
                    source={Heroes.get(this.props.item.hero).icon}
                    style={[styles.heroIcon, {tintColor: CONFIG.COLORS.COMMON,},]}
                />
            );
        }

        if (this.props.addEventIcon && this.props.item.event) {
            eventIcon = (
                <Image
                    source={Events.ITEMS[this.props.item.event].icon}
                    style={[styles.eventIcon, {tintColor: CONFIG.COLORS.COMMON,},]}
                />
            );
        }

        if (this.props.item.price) {
            price = (
                <Text style={[styles.price, {color: CONFIG.COLORS.COMMON}]}>
                    {this.props.item.price}
                </Text>
            );
        }

        return (
            <Image source={this.props.item.thumbnail} style={[styles.icon, size, style,]}>
                <TouchableWithoutFeedback
                    onPress={() => this.props.onPress(this.props.item, this.props.index)}
                    onLongPress={() => this.props.onLongPress(this.props.item, this.props.index)}
                >

                    <View style={styles.iconContent}>
                        {heroIcon}
                        {eventIcon}
                        {price}
                    </View>

                </TouchableWithoutFeedback>
            </Image>
        );
    };
}

export class IconsList extends Component {
    static propTypes = {
        onItemPress: React.PropTypes.func,
        addHeroIcon: React.PropTypes.bool,
        addEventIcon: React.PropTypes.bool,
    };

    static defaultProps = {
        addHeroIcon: true,
        addEventIcon: true,
    };

    isShouldComponentUpdate = false;

    preview;

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
        let items = {};

        Items.select(null, Items.TYPE.ICON).map(item => {
            items[item.uid] = item;
        });

        for (let i in this.state.data) if (this.state.data.hasOwnProperty(i)) {
            if (this.state.data[i].received !== items[this.state.data[i].uid].received) {
                this.loadItems();

                return;
            }
        }
    }

    getData() {
        let data = [];

        this.state.data.map(item => {
            data.push(Object.assign({}, item));
        });

        return data;
    }

    loadItems() {
        let data = [];

        Items.select(null, Items.TYPE.ICON).map(item => {
            data.push(Object.assign({}, item));
        });

        data.sort((a, b) => {
            if (a.default === b.default) {
                return 0;
            }

            return a.default && !b.default ? -1 : 1;
        });

        this.isShouldComponentUpdate = true;

        this.setState({
            data: data,
        });
    }

    onItemPress(index) {
        let data = this.getData();

        if (data[index].default) {
            return;
        }

        data[index].received = !data[index].received;

        Items.receiveItem(data[index].uid, data[index].received);

        this.isShouldComponentUpdate = true;

        this.setState({
            data: data,
        });
    }

    onItemLongPress(item) {
        this.preview.showItem(item);
    }

    renderItem(item, index) {
        return (
            <Item
                index={index}
                item={item}
                onPress={(item, index) => this.onItemPress(index)}
                onLongPress={(item, index) => this.onItemLongPress(item)}
                addHeroIcon={this.props.addHeroIcon}
                addEventIcon={this.props.addEventIcon}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <Preview ref={component => this.preview = component}/>
                <ItemsProgress type={Items.TYPE.ICON} showAmount={false}/>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => item.uid}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    numColumns={GRID_SIZE}
                    columnWrapperStyle={styles.columnWrapperStyle}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    columnWrapperStyle: {
        justifyContent: 'center',
    },
    icon: {
        margin: 6,
        borderRadius: 6,
        resizeMode: 'cover',
    },
    iconContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    heroIcon: {
        height: 28,
        width: 28,
    },
    eventIcon: {
        height: 20,
        width: 20,
        margin: 4,
    },
    iconOpacity: {
        opacity: 0.3,
    },
});

"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    TouchableWithoutFeedback,
    Image,
    Text,
} from 'react-native';

import CONFIG from './../config';
import Items from './../Items';
import Events from './../Events';
import Heroes from './../Heroes';
import {
    ModalPreview,
} from './'

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

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        let style = null, heroIcon, eventIcon, price;

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
            <View style={{borderRadius: 6,}}>
            <Image source={this.props.item.source} style={[styles.icon, style,]}>
                <TouchableWithoutFeedback
                    onPress={() => this.props.onPress(this.props.index, this.props.item)}
                    onLongPress={() => this.props.onLongPress(this.props.index, this.props.item)}
                >

                    <View style={styles.iconContent}>
                        {heroIcon}
                        {eventIcon}
                        {price}
                    </View>

                </TouchableWithoutFeedback>
            </Image>
            </View>
        );
    };
}

export class IconsList extends Component {
    static propTypes = {
        onItemPress: React.PropTypes.func,
        showProgress: React.PropTypes.bool,
        addHeroIcon: React.PropTypes.bool,
        addEventIcon: React.PropTypes.bool,
    };

    static defaultProps = {
        showProgress: true,
        addHeroIcon: true,
        addEventIcon: false,
    };

    isShouldComponentUpdate = false;

    constructor(props, context, updater) {
        super(props, context, updater);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return r1.received !== r2.received;
            },
        });

        this.state = {
            data: [],
            dataSource: dataSource,
            progress: {received: 0, total: 0,},
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

        Items.select(null, Items.TYPE.ICON).map((item) => {
            items[item.uid] = item;
        });

        for (let i in this.state.data) if (this.state.data.hasOwnProperty(i)) {
            if (this.state.data[i].received !== items[this.state.data[i].uid].received) {
                this.loadItems();
                break;
            }
        }
    }

    getData() {
        let data = [];

        this.state.data.map((item) => {
            data.push(Object.assign({}, item));
        });

        return data;
    }

    loadItems() {
        let data = [], progress = {received: 0, total: 0,};

        Items.select(null, Items.TYPE.ICON).map((item) => {
            if (!item.default) {
                progress.total++;

                if (item.received) {
                    progress.received++;
                }
            }

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
            dataSource: this.state.dataSource.cloneWithRows(data),
            progress: progress,
        });
    }

    onItemPress(index) {
        let data = this.getData(),
            progress = Object.assign({}, this.state.progress);

        if (data[index].default) {
            return;
        }

        data[index].received = !data[index].received;

        if (data[index].received) {
            progress.received++;
        } else {
            progress.received--;
        }

        this.isShouldComponentUpdate = true;

        this.setState({
            data: data,
            dataSource: this.state.dataSource.cloneWithRows(data),
            progress: progress,
        }, () => Items.receiveItem(data[index].uid, data[index].received));
    }

    onItemLongPress(item) {
        if (CONFIG.NETWORK === 'NONE') {
            this.modal.show(item.name, `${_('NO_INTERNET_CONNECTION')}`);

            return;
        }

        this.modal.show(item.name, null, item.source);
    }

    renderItem(rowData, rowID) {
        return (
            <Item
                index={parseInt(rowID)}
                item={rowData}
                onPress={(index, item) => this.onItemPress(index)}
                onLongPress={(index, item) => this.onItemLongPress(item)}
                addHeroIcon={this.props.addHeroIcon}
                addEventIcon={this.props.addEventIcon}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ModalPreview ref={(component) => this.modal = component}/>
                <View style={styles.progress}>
                    <Text style={styles.progressTitle}>{`${this.state.progress.received}/${this.state.progress.total}`}</Text>
                </View>
                <ListView
                    contentContainerStyle={styles.contentContainer}
                    dataSource={this.state.dataSource}
                    initialListSize={256}
                    renderRow={(rowData, sectionID, rowID, highlightRow) => this.renderItem(rowData, rowID)}
                />
            </View>
        );
    }
}

const GRID_SIZE = 4;
const ITEM_SIZE = Math.round(CONFIG.DIMENSIONS.SCREEN_WIDTH / GRID_SIZE) - (6 * 4);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progress: {
        height: 56,
        marginHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    progressTitle: {
        fontSize: 32,
        marginHorizontal: 8,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.LIGHT_BLUE,
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
    price: {
        marginHorizontal: 8,
        fontSize: 21,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.WHITE_OPACITY,
    },
    icon: {
        height: ITEM_SIZE,
        width: ITEM_SIZE,
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
    iconOpacity: {
        opacity: 0.3,
    },
});

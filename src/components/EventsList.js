"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Image,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CONFIG from './../config';
import _ from './../l10n';
import Events from './../Events';
import Items from './../Items';
import {
    Touchable,
} from './';

class Item extends Component {
    static propTypes = {
        index: React.PropTypes.number.isRequired,
        item: React.PropTypes.object.isRequired,
        onPress: React.PropTypes.func.isRequired,
    };

    static defaultProps = {};

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        let progress;

        if (this.props.item.progress) {
            progress = (
                <Text style={styles.progress}>{`${this.props.item.progress.received}/${this.props.item.progress.total}`}</Text>
            );
        }

        return (
            <Touchable onPress={() => this.props.onPress(this.props.index, this.props.item)}>
                <View style={styles.item}>
                    <Image source={this.props.item.icon} style={styles.icon}/>
                    <Text
                        numberOfLines={1}
                        style={styles.name}
                    >

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
        showProgress: React.PropTypes.bool,
    };

    static defaultProps = {
        showProgress: true,
    };

    isShouldComponentUpdate = false;

    constructor(props, context, updater) {
        super(props, context, updater);

        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                if (this.props.showProgress) {
                    if (r1.progress && r2.progress) {
                        if (r1.progress.received !== r2.progress.received) {
                            return true;
                        }
                    }
                }

                return r1.name !== r2.name;
            },
        });

        this.state = {
            data: [],
            dataSource: dataSource,
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

        Object.values(Events.ITEMS).map((item) => {
            data.push(Object.assign({}, item));
        });

        if (this.props.showProgress) {
            progress = Items.getProgressByEvents();
        }

        data.map((item) => {
            item.name = _(item.code);
            if (progress[item.id]) {
                item.progress = progress[item.id];
            }
        });

        data.reverse();

        this.isShouldComponentUpdate = true;

        this.setState({
            data: data,
            dataSource: this.state.dataSource.cloneWithRows(data),
        });
    }

    renderItem(rowData, rowID) {
        return (
            <Item
                index={parseInt(rowID)}
                item={rowData}
                onPress={this.props.onItemPress}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    contentContainerStyle={styles.contentContainer}
                    dataSource={this.state.dataSource}
                    initialListSize={32}
                    renderRow={(rowData, sectionID, rowID, highlightRow) => this.renderItem(rowData, rowID)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {},
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
        fontSize: 28,
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

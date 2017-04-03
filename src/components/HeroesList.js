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
import _ from './../l10n';
import Items from './../Items';
import Heroes from './../Heroes';

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

        // @todo: fix the problem with border radius of background
        // background for portraits
        // <Image source={require('./../assets/heroes/background.jpg')} style={styles.background}>
        //     <Image source={this.props.item.portrait} style={styles.portrait}/>
        // </Image>

        return (
            <TouchableWithoutFeedback onPress={() => this.props.onPress(this.props.index, this.props.item)}>
                <View style={styles.item}>
                    <Image source={this.props.item.portrait} style={styles.portrait}/>
                    <View style={styles.info}>
                        <Text style={styles.name}>{this.props.item.name}</Text>
                        {progress}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };
}

export class HeroesList extends Component {
    static propTypes = {
        onItemPress: React.PropTypes.func,
        showProgress: React.PropTypes.bool,
        progressEvent: React.PropTypes.object,
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

                        if (r1.progress.total !== r2.progress.total) {
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
            progress = Items.getProgressByHeroes(nextProps.progressEvent && nextProps.progressEvent.id);
        }

        for (let i in this.state.data) if (this.state.data.hasOwnProperty(i)) {
            if (progress) {
                if (
                    this.state.data[i].progress
                    && (
                        this.state.data[i].progress.received !== progress[this.state.data[i].id].received
                        || this.state.data[i].progress.total !== progress[this.state.data[i].id].total
                    )
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

        if (this.props.showProgress) {
            progress = Items.getProgressByHeroes(this.props.progressEvent && this.props.progressEvent.id);
        }

        Object.values(Heroes.ITEMS).map((item) => {
            if (this.props.showProgress && !progress[item.id]) {
                return;
            }

            data.push(Object.assign({}, item));
        });

        data.map((item) => {
            item.name = _(item.code);
            if (this.props.showProgress) {
                if (progress[item.id]) {
                    item.progress = progress[item.id];
                }
            }
        });

        data.sort((a, b) => {
            if (a.name === b.name) {
                return 0;
            }

            return a.name > b.name ? 1 : -1;
        });

        this.isShouldComponentUpdate = true;

        this.setState({
            data: data,
            dataSource: this.state.dataSource.cloneWithRows(data),
            progress: progress,
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
                    initialListSize={64}
                    renderRow={(rowData, sectionID, rowID, highlightRow) => this.renderItem(rowData, rowID)}
                />
            </View>
        );
    }
}

const GRID_SIZE = 4;
const ITEM_SIZE = Math.round(CONFIG.DIMENSIONS.SCREEN_WIDTH / GRID_SIZE) - (2 * 2 * GRID_SIZE);

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
    item: {
        margin: 2,
        padding: 2,
        borderRadius: 6,
        backgroundColor: CONFIG.COLORS.LIGHT_GRAY,
    },
    background: {
        height: ITEM_SIZE,
        width: ITEM_SIZE,
        resizeMode: 'cover',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    portrait: {
        height: ITEM_SIZE,
        width: ITEM_SIZE,
        resizeMode: 'cover',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    info: {
        alignItems: 'stretch',
    },
    name: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'BigNoodleTooOblique',
        color: CONFIG.COLORS.DARK_BLUE,
    },
    progress: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.LIGHT_BLUE,
    },
});

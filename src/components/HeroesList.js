"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    TouchableWithoutFeedback,
    Image,
    Text,
} from 'react-native';

import CONFIG from './../config';
import _ from './../l10n';
import Items from './../Items';
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
        // <Image source={require('./../assets/heroes/background.jpg')} style={styles.portrait}>
        //     <Image source={this.props.item.portrait} style={styles.portrait}/>
        // </Image>

        return (
            <TouchableWithoutFeedback
                onPress={() => this.props.onPress(this.props.index, this.props.item)}
                onLongPress={() => this.props.onLongPress(this.props.index, this.props.item)}
            >

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

    modal;

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
            progress: progress,
        });
    }

    onItemLongPress(item) {
        if (CONFIG.NETWORK === 'NONE') {
            this.modal.show(item.name, `${_('NO_INTERNET_CONNECTION')}`);

            return;
        }

        this.modal.show(item.name, null, item.background);
    }

    renderItem(item, index) {
        return (
            <Item
                index={parseInt(index)}
                item={item}
                onPress={this.props.onItemPress}
                onLongPress={(index, item) => this.onItemLongPress(item)}
            />
        );
    }

    shouldItemUpdate(prev, next) {
        if (this.props.showProgress) {
            if (prev.item.progress && next.item.progress) {
                if (prev.item.progress.received !== next.item.progress.received) {
                    return true;
                }

                if (prev.item.progress.total !== next.item.progress.total) {
                    return true;
                }
            }
        }

        return prev.item.name !== next.item.name;
    }

    render() {
        return (
            <View style={styles.container}>
                <ModalPreview ref={(component) => this.modal = component}/>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => item.id}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    shouldItemUpdate={(prev, next) => this.shouldItemUpdate(prev, next)}
                    numColumns={GRID_SIZE}
                    columnWrapperStyle={styles.columnWrapperStyle}
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
    columnWrapperStyle: {
        justifyContent: 'center',
    },
    item: {
        margin: 2,
        padding: 2,
        borderRadius: 6,
        backgroundColor: CONFIG.COLORS.LIGHT_GRAY,
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

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
    };

    static defaultProps = {};

    SIZE;

    onDimensionsChangedHandler = event => this.onDimensionsChanged(event);

    constructor(props, context, updater) {
        super(props, context, updater);
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
        let progress, size = {height: this.SIZE, width: this.SIZE,};

        if (this.props.item.progress) {
            progress = (
                <Text style={styles.progress}>{`${this.props.item.progress.received}/${this.props.item.progress.total}`}</Text>
            );
        }

        // @todo: fix the problem with border radius of background
        // background for portraits
        // <Image source={require('./../assets/heroes/background.jpg')} style={[styles.portrait, size,]}>
        //     <Image source={this.props.item.portrait} style={[styles.portrait, size,]}/>
        // </Image>

        return (
            <TouchableWithoutFeedback
                onPress={() => this.props.onPress(this.props.item, this.props.index)}
                onLongPress={() => this.props.onLongPress(this.props.item, this.props.index)}
            >

                <View style={styles.item}>
                    <Image source={this.props.item.portrait} style={[styles.portrait, size,]}/>
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

        Object.values(Heroes.ITEMS).map(item => {
            if (this.props.showProgress && !progress[item.id]) {
                return;
            }

            data.push(Object.assign({}, item));
        });

        data.map(item => {
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
        });
    }

    onItemLongPress(item) {
        this.preview.showHero(item);
    }

    renderItem(item, index) {
        return (
            <Item
                index={index}
                item={item}
                onPress={this.props.onItemPress}
                onLongPress={(item, index) => this.onItemLongPress(item)}
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
                <Preview ref={component => this.preview = component}/>
                <ItemsProgress hero={true} event={this.props.progressEvent}/>
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
        resizeMode: 'cover',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },
    info: {
        alignItems: 'stretch',
    },
    name: {
        textAlign: 'center',
        fontSize: 14,
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

"use strict";

import React, {Component} from 'react';
import {
    Vibration,
    Dimensions,
    StyleSheet,
    View,
    ScrollView,
    FlatList,
    Image,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CONFIG from './../config';
import _ from './../i18n';
import CloudStorage from './../CloudStorage';
import Items from './../Items';
import Events from './../Events';
import Heroes from './../Heroes';
import {
    Touchable,
    Preview,
    RemainingAmount,
} from './';

const GRID_SIZE = 4;

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
        let textStyle, heroIcon, eventIcon, name = _(this.props.item.uid), price, check;

        textStyle = {color: Items.COLOR[this.props.item.rarity],};

        if (this.props.addHeroIcon && this.props.item.hero) {
            heroIcon = (<Image source={Heroes.get(this.props.item.hero).icon} style={styles.itemHeroIcon}/>);
        } else if (this.props.addHeroIcon) {
            heroIcon = (<Image source={require('./../assets/heroes/OVERWATCH.icon.png')} style={styles.itemHeroIcon}/>);
        }

        if (this.props.addEventIcon && this.props.item.event) {
            eventIcon = (<Image source={Events.ITEMS[this.props.item.event].icon} style={styles.itemEventIcon}/>);
        }

        if (this.props.item.price) {
            price = (<Text style={styles.itemPrice}>{this.props.item.price.toString()}</Text>);
        }

        if (!this.props.item.default) {
            check = (
                <Icon
                    name={this.props.item.received ? 'check' : 'check-box-outline-blank'}
                    color={this.props.item.received ? CONFIG.COLORS.GREEN : CONFIG.COLORS.WHITE_OPACITY}
                    size={32}
                />
            );
        } else if (this.props.item.type !== Items.TYPE.WEAPON) {
            name = `${name} [ ${_('ITEMS__ITEM_DEFAULT')} ]`;
        }

        return (
            <Touchable
                onPress={() => this.props.onPress(this.props.item, this.props.index)}
            >

                <View style={styles.item}>
                    {heroIcon}
                    {eventIcon}
                    <Text numberOfLines={1} style={[styles.itemName, textStyle,]}>
                        {name.toUpperCase()}
                    </Text>
                    {price}
                    {check}
                </View>

            </Touchable>
        );
    }
}

class GridItem extends Component {
    static propTypes = {
        index: React.PropTypes.number.isRequired,
        item: React.PropTypes.object.isRequired,
        onPress: React.PropTypes.func.isRequired,
        onLongPress: React.PropTypes.func,
    };

    static defaultProps = {
        onLongPress: () => null,
    };

    SIZE;

    onDimensionsChangedHandler = (event) => this.onDimensionsChanged(event);

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
        let size = {height: this.SIZE, width: this.SIZE,}, style = null, heroIcon, eventIcon, price;

        if (!this.props.item.default && !this.props.item.received) {
            style = styles.gridItemOpacity;
        }

        if (this.props.addHeroIcon && this.props.item.hero) {
            heroIcon = (
                <Image
                    source={Heroes.get(this.props.item.hero).icon}
                    style={[styles.gridItemHeroIcon, {tintColor: CONFIG.COLORS.COMMON,},]}
                />
            );
        } else if (this.props.addHeroIcon) {
            heroIcon = (
                <Image
                    source={require('./../assets/heroes/OVERWATCH.icon.png')}
                    style={[styles.gridItemHeroIcon, {tintColor: CONFIG.COLORS.COMMON,},]}
                />
            );
        }

        if (this.props.addEventIcon && this.props.item.event) {
            eventIcon = (
                <Image
                    source={Events.ITEMS[this.props.item.event].icon}
                    style={[styles.gridItemEventIcon, {tintColor: CONFIG.COLORS.COMMON,},]}
                />
            );
        }

        if (this.props.item.price) {
            price = (
                <Text style={[styles.itemPrice, {color: CONFIG.COLORS.COMMON}]}>
                    {this.props.item.price.toString()}
                </Text>
            );
        }

        return (
            <Image source={this.props.item.source} style={[styles.gridItem, size, style,]}>
                <TouchableWithoutFeedback
                    onPress={() => this.props.onPress(this.props.item, this.props.index)}
                    onLongPress={() => this.props.onLongPress(this.props.item, this.props.index)}
                >

                    <View style={styles.gridItemContent}>
                        {heroIcon}
                        {eventIcon}
                        {price}
                    </View>

                </TouchableWithoutFeedback>
            </Image>
        );
    }
}

class Section extends Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        progress: React.PropTypes.object.isRequired,
        data: React.PropTypes.array.isRequired,
        onItemPress: React.PropTypes.func.isRequired,
        isVisible: React.PropTypes.bool,
        onHeaderPress: React.PropTypes.func,
        onHeaderLongPress: React.PropTypes.func,
        onItemLongPress: React.PropTypes.func,
        numColumns: React.PropTypes.number,
        addHeroIcon: React.PropTypes.bool,
        addEventIcon: React.PropTypes.bool,
    };

    static defaultProps = {
        isVisible: false,
        numColumns: 1,
    };

    isShouldComponentUpdate = false;

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            title: this.props.title,
            progress: this.props.progress,
            data: this.props.data,
            isVisible: this.props.isVisible,
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.isShouldComponentUpdate) {
            this.isShouldComponentUpdate = false;

            return true;
        }

        return false;
    }

    componentWillReceiveProps(nextProps) {
        let state = {};

        if (this.state.title !== nextProps.title) {
            state.title = nextProps.title;
        }

        if (
            this.state.progress.received !== nextProps.progress.received
            || this.state.progress.total !== nextProps.progress.total
        ) {
            state.progress = nextProps.progress;
        }

        if (this.state.isVisible !== nextProps.isVisible) {
            state.isVisible = nextProps.isVisible;
        }

        this.state.data.map((item, index) => {
            if (item.received !== nextProps.data[index].received) {
                state.data = nextProps.data;
            }
        });

        if (Object.keys(state).length > 0) {
            this.isShouldComponentUpdate = true;

            this.setState(state);
        }
    }

    renderItem(item, index) {
        if (this.props.numColumns > 1) {
            return (
                <GridItem
                    index={index}
                    item={item}
                    onPress={this.props.onItemPress}
                    onLongPress={this.props.onItemLongPress}
                    addHeroIcon={this.props.addHeroIcon}
                    addEventIcon={this.props.addEventIcon}
                />
            );
        }

        return (
            <Item
                index={index}
                item={item}
                onPress={this.props.onItemPress}
                onLongPress={this.props.onItemLongPress}
                addHeroIcon={this.props.addHeroIcon}
                addEventIcon={this.props.addEventIcon}
            />
        );
    }

    shouldItemUpdate(prev, next) {
        return prev.item.received !== next.item.received;
    }

    render() {
        let header, list;

        if (this.state.isVisible) {
            list = (
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => item.uid}
                    initialNumToRender={128}
                    renderItem={({item, index}) => this.renderItem(item, index)}
                    shouldItemUpdate={(prev, next) => this.shouldItemUpdate(prev, next)}
                    numColumns={this.props.numColumns}
                    columnWrapperStyle={(this.props.numColumns > 1 ? styles.columnWrapperStyle : null)}
                />
            );
        }

        header = (
            <View style={styles.sectionHeader}>
                <Text numberOfLines={1} style={styles.sectionHeaderTitle}>
                    {this.state.title}
                </Text>
                <Text style={styles.sectionHeaderProgress}>
                    {`${this.state.progress.received}/${this.state.progress.total}`}
                </Text>
                {this.props.onHeaderPress && (
                    <Icon
                        name={this.state.isVisible ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
                        color="#FFFFFF"
                        size={24}
                    />
                )}
            </View>
        );

        if (this.props.onHeaderPress && this.props.onHeaderLongPress) {
            header = (
                <Touchable
                    onPress={this.props.onHeaderPress}
                    onLongPress={this.props.onHeaderLongPress}
                >
                    {header}
                </Touchable>
            );
        } else if (this.props.onHeaderPress) {
            header = (
                <Touchable
                    onPress={this.props.onHeaderPress}
                >
                    {header}
                </Touchable>
            );
        } else if (this.props.onHeaderLongPress) {
            header = (
                <Touchable
                    onLongPress={this.props.onHeaderLongPress}
                >
                    {header}
                </Touchable>
            );
        }

        return (
            <View style={styles.section}>
                {header}
                {list}
            </View>
        );
    }
}

export class ItemsList extends Component {
    static propTypes = {
        type: React.PropTypes.number,
        rarity: React.PropTypes.number,
        hero: React.PropTypes.object,
        event: React.PropTypes.object,
        isCollapsible: React.PropTypes.bool,
        addHeroIcon: React.PropTypes.bool,
        addEventIcon: React.PropTypes.bool,
    };

    static defaultProps = {
        isCollapsible: true,
        addHeroIcon: true,
        addEventIcon: false,
    };

    static gridSections = [
        Items.TYPE.SPRAY,
        Items.TYPE.ICON,
    ];

    isShouldComponentUpdate = false;

    modal;

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = {
            sections: {},
            openedSections: [],
            remainingAmount: 0,
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
        let needUpdate = false, items = {};

        this.getItems().map((item) => {
            items[item.uid] = item;
        });

        Object.values(this.state.sections).map((section) => {
            if (needUpdate) {
                return;
            }

            section.data.map((item) => {
                if (needUpdate) {
                    return;
                }

                needUpdate = item.received !== items[item.uid].received;
            });
        });

        if (needUpdate) {
            this.loadItems();
        }
    }

    getItems() {
        return Items.select(
            null,
            this.props.type && this.props.type,
            this.props.rarity && this.props.rarity,
            this.props.hero && this.props.hero.id,
            this.props.event && this.props.event.id
        );
    }

    loadItems() {
        let sections = {}, remainingAmount = 0;

        this.getItems().map((item) => {
            if (!sections[item.type]) {
                sections[item.type] = {
                    type: item.type,
                    title: _(`ITEMS__ITEMS_TYPE_${item.type}`),
                    progress: {received: 0, total: 0,},
                    isVisible: this.props.isCollapsible ? this.state.openedSections.indexOf(item.type) !== -1 : true,
                    data: [],
                };
            }

            if (!item.default) {
                sections[item.type].progress.total++;

                if (item.received) {
                    sections[item.type].progress.received++;
                }
            }

            if (!item.received) {
                remainingAmount += item.price;
            }

            sections[item.type].data.push(Object.assign({}, item));

            sections[item.type].data.sort((a, b) => {
                if (_(a.uid) === _(b.uid)) {
                    return 0;
                }

                return _(a.uid) < _(b.uid) ? -1 : 1;
            });

            sections[item.type].data.sort((a, b) => {
                if (a.event === b.event) {
                    return 0;
                }

                return a.event < b.event ? -1 : 1;
            });

            sections[item.type].data.sort((a, b) => {
                if (a.rarity === b.rarity) {
                    return 0;
                }

                return a.rarity < b.rarity ? -1 : 1;
            });

            sections[item.type].data.sort((a, b) => {
                if (a.default === b.default) {
                    return 0;
                }

                return a.default < b.default ? 1 : -1;
            });
        });

        this.isShouldComponentUpdate = true;

        this.setState({
            sections: sections,
            remainingAmount: remainingAmount,
        });
    }

    getSections() {
        let sections = {};

        Object.values(this.state.sections).map((section) => {
            sections[section.type] = {
                type: section.type,
                title: section.title,
                progress: Object.assign({}, section.progress),
                isVisible: section.isVisible,
                data: [],
            };

            section.data.map((item) => {
                sections[section.type].data.push(Object.assign({}, item));
            });
        });

        return sections;
    }

    onSectionHeaderPress(section) {
        let sections = this.getSections(), openedSections = this.state.openedSections;

        sections[section.type].isVisible = !sections[section.type].isVisible;

        if (sections[section.type].isVisible) {
            openedSections.push(section.type);
        } else {
            openedSections = openedSections.filter((item) => {
                return item !== section.type;
            });
        }

        this.isShouldComponentUpdate = true;

        this.setState({
            sections: sections,
            openedSections: openedSections,
        });
    }

    onSectionHeaderLongPress(section) {
        Vibration.vibrate(20);

        this.getItems().map((item) => {
            if (item.type === section.type) {
                Items.receiveItem(item.uid, true);
            }
        });

        this.loadItems();
    }

    onItemPress(item, index) {
        if (item.default) {
            return;
        }

        let sections = this.getSections(),
            remainingAmount = this.state.remainingAmount;

        sections[item.type].data[index].received = !sections[item.type].data[index].received;

        if (sections[item.type].data[index].received) {
            remainingAmount -= item.price;
            sections[item.type].progress.received++;
        } else {
            remainingAmount += item.price;
            sections[item.type].progress.received--;
        }

        this.isShouldComponentUpdate = true;

        this.setState({
            sections: sections,
            remainingAmount: remainingAmount,
        }, () => Items.receiveItem(sections[item.type].data[index].uid, sections[item.type].data[index].received));
    }

    onItemLongPress(item, index) {
        let title = _(item.uid);

        if (CONFIG.NETWORK === 'NONE') {
            this.modal.error(title, _('ERROR__NO_INTERNET_CONNECTION'));

            return;
        }

        this.modal.open(title, null);

        CloudStorage.getFileUrl(`items/previews/${item.type}/${item.uid}.png`)
            .then((url) => this.modal.open(title, {uri: url,}))
            .catch((error) => this.modal.error(title, _('ERROR__PREVIEW_NOT_FOUND')));
    }

    render() {
        let backgroundHero = null, sections = [], onSectionHeaderPress = null;

        if (this.props.hero) {
            backgroundHero = (<Image source={this.props.hero.background} style={styles.backgroundHero}/>);
        }

        Object.values(this.state.sections).map((section, index) => {
            if (this.props.isCollapsible) {
                onSectionHeaderPress = () => this.onSectionHeaderPress(section);
            }

            sections.push(
                <Section
                    key={`section-${index}`}
                    title={section.title}
                    progress={section.progress}
                    data={section.data}
                    isVisible={section.isVisible}
                    onHeaderPress={onSectionHeaderPress}
                    onHeaderLongPress={() => this.onSectionHeaderLongPress(section)}
                    onItemPress={(item, index) => this.onItemPress(item, index)}
                    onItemLongPress={(item, index) => this.onItemLongPress(item, index)}
                    addHeroIcon={this.props.addHeroIcon}
                    addEventIcon={this.props.addEventIcon}
                    numColumns={ItemsList.gridSections.indexOf(section.type) !== -1 ? GRID_SIZE : 1}
                />
            );
        });

        return (
            <View style={styles.container}>
                {backgroundHero}
                <Preview ref={(component) => this.modal = component}/>
                <RemainingAmount amount={this.state.remainingAmount}/>
                <ScrollView>
                    {sections}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundHero: {
        position: 'absolute',
        opacity: 0.8,
    },
    section: {
        backgroundColor: CONFIG.COLORS.DARK_BLUE_OPACITY,
    },
    sectionHeader: {
        height: 56,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CONFIG.COLORS.LIGHT_BLUE_OPACITY,
    },
    sectionHeaderTitle: {
        fontSize: 24,
        fontFamily: 'BigNoodleToo',
        color: '#FFFFFF',
    },
    sectionHeaderProgress: {
        flex: 1,
        margin: 8,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.DARK_BLUE,
    },
    columnWrapperStyle: {
        justifyContent: 'center',
    },
    item: {
        height: 48,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemHeroIcon: {
        height: 28,
        width: 28,
        marginLeft: 8,
    },
    itemEventIcon: {
        height: 18,
        width: 18,
        marginLeft: 8,
        marginVertical: 4,
    },
    itemName: {
        flex: 1,
        marginLeft: 8,
        fontSize: 21,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.COMMON,
    },
    itemPrice: {
        marginHorizontal: 8,
        fontSize: 21,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.WHITE_OPACITY,
    },
    gridItem: {
        margin: 6,
        borderRadius: 6,
        resizeMode: 'contain',
    },
    gridItemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    gridItemHeroIcon: {
        height: 28,
        width: 28,
    },
    gridItemEventIcon: {
        height: 20,
        width: 20,
        margin: 4,
    },
    gridItemOpacity: {
        opacity: 0.3,
    },
});

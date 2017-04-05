"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    ListView,
    Image,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CONFIG from './../config';
import _ from './../l10n';
import CloudStorage from './../CloudStorage';
import Items from './../Items';
import Events from './../Events';
import Heroes from './../Heroes';
import {
    Touchable,
    PreviewModal,
} from './';

class SectionHeader extends Component {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
        isOpened: React.PropTypes.bool,
        onCollapse: React.PropTypes.func,
        progress: React.PropTypes.object,
    };

    static defaultProps = {};

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        let progress, header;

        if (this.props.progress) {
            progress = (
                <Text style={styles.sectionHeaderProgress}>
                    {`${this.props.progress.received}/${this.props.progress.total}`}
                </Text>
            );
        }

        header = (
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderTitle}>{this.props.title}</Text>
                {progress}
                {this.props.onCollapse && (
                    <Icon
                        name={this.props.isOpened ? 'keyboard-arrow-down' : 'keyboard-arrow-right'}
                        color="#FFFFFF"
                        size={24}
                    />
                )}
            </View>
        );

        if (this.props.onCollapse) {
            header = (
                <Touchable onPress={this.props.onCollapse}>
                    {header}
                </Touchable>
            );
        }

        return header;
    }
}

class Item extends Component {
    static propTypes = {
        index: React.PropTypes.number.isRequired,
        item: React.PropTypes.object.isRequired,
        onCheck: React.PropTypes.func.isRequired,
        onPress: React.PropTypes.func.isRequired,
        addHeroIcon: React.PropTypes.bool,
        addHeroName: React.PropTypes.bool,
        addEventIcon: React.PropTypes.bool,
    };

    static defaultProps = {
        addHeroIcon: true,
        addHeroName: false,
        addEventIcon: false,
    };

    static previewTypes = [
        Items.TYPE.SPRAY,
        Items.TYPE.ICON,
    ];

    constructor(props, context, updater) {
        super(props, context, updater);
    }

    render() {
        if (this.props.item.visible === false) {
            return null;
        }

        let textStyle, heroIcon, eventIcon, nameSection, checkSection, price, name = _(this.props.item.name);

        textStyle = {color: Items.COLOR[this.props.item.rarity],};

        if (this.props.addHeroIcon && this.props.item.hero) {
            heroIcon = (<Image source={Heroes.get(this.props.item.hero).icon} style={styles.itemHeroIcon}/>);
        } else if (this.props.addHeroIcon) {
            heroIcon = (<Image source={require('./../assets/heroes/OVERWATCH.icon.png')} style={styles.itemHeroIcon}/>);
        }

        if (this.props.addHeroName && this.props.item.hero) {
            name = `${name} [ ${_(Heroes.get(this.props.item.hero.code))} ]`;
        }

        if (this.props.addEventIcon && this.props.item.event) {
            eventIcon = (<Image source={Events.ITEMS[this.props.item.event].icon} style={styles.itemEventIcon}/>);
        }

        if (this.props.item.price) {
            price = (<Text style={styles.itemPrice}>{this.props.item.price.toString()}</Text>);
        }

        if (!this.props.item.default) {
            checkSection = (
                <Touchable onPress={() => this.props.onCheck(this.props.index, this.props.item)}>
                    <View style={styles.itemTouchable}>
                        {price}
                        <Icon
                            name={this.props.item.received ? 'check' : 'check-box-outline-blank'}
                            color={this.props.item.received ? CONFIG.COLORS.GREEN : CONFIG.COLORS.WHITE_OPACITY}
                            size={32}
                        />
                    </View>
                </Touchable>
            );
        } else if (!this.props.addHeroName) {
            name = `${name} [ ${_('ITEM_DEFAULT')} ]`;
        }

        nameSection = (
            <View style={[styles.itemTouchable, {flex: 1,},]}>
                {heroIcon}
                {eventIcon}
                <Text numberOfLines={1} style={[styles.itemName, textStyle,]}>{name.toUpperCase()}</Text>
            </View>
        );

        if (Item.previewTypes.indexOf(this.props.item.type) !== -1) {
            nameSection = (
                <Touchable onPress={() => this.props.onPress(this.props.index, this.props.item)}>
                    {nameSection}
                </Touchable>
            );
        }

        return (
            <View style={styles.item}>
                {nameSection}
                {checkSection}
            </View>
        );
    }
}

class ImageItem extends Component {
    static propTypes = {
        index: React.PropTypes.number.isRequired,
        item: React.PropTypes.object.isRequired,
        onCheck: React.PropTypes.func.isRequired,
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
        if (this.props.item.visible === false) {
            return null;
        }

        let style = null, heroIcon, eventIcon, price;

        if (!this.props.item.default && !this.props.item.received) {
            style = styles.imageItemOpacity;
        }

        if (this.props.addHeroIcon && this.props.item.hero) {
            heroIcon = (
                <Image
                    source={Heroes.get(this.props.item.hero).icon}
                    style={[styles.imageItemHeroIcon, {tintColor: CONFIG.COLORS.COMMON,},]}
                />
            );
        } else if (this.props.addHeroIcon) {
            heroIcon = (
                <Image
                    source={require('./../assets/heroes/OVERWATCH.icon.png')}
                    style={[styles.imageItemHeroIcon, {tintColor: CONFIG.COLORS.COMMON,},]}
                />
            );
        }

        if (this.props.addEventIcon && this.props.item.event) {
            eventIcon = (
                <Image
                    source={Events.ITEMS[this.props.item.event].icon}
                    style={[styles.imageItemEventIcon, {tintColor: CONFIG.COLORS.COMMON,},]}
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
            <Image source={this.props.item.source} style={[styles.imageItem, style,]}>
                <TouchableWithoutFeedback
                    onPress={() => this.props.onCheck(this.props.index, this.props.item)}
                    onLongPress={() => this.props.onLongPress(this.props.index, this.props.item)}
                >

                    <View style={styles.imageContent}>
                        {heroIcon}
                        {eventIcon}
                        {price}
                    </View>

                </TouchableWithoutFeedback>
            </Image>
        );
    };
}

export class ItemsList extends Component {
    static propTypes = {
        type: React.PropTypes.number,
        rarity: React.PropTypes.number,
        hero: React.PropTypes.object,
        event: React.PropTypes.object,
        isCollapsible: React.PropTypes.bool,
        addHeroIcon: React.PropTypes.bool,
        addHeroName: React.PropTypes.bool,
        addEventIcon: React.PropTypes.bool,
    };

    static defaultProps = {
        isCollapsible: true,
        addHeroIcon: true,
        addHeroName: false,
        addEventIcon: false,
    };

    static sections = {
        [Items.TYPE.SKIN]: 1,
        [Items.TYPE.EMOTE]: 2,
        [Items.TYPE.VICTORY_POSE]: 3,
        [Items.TYPE.VOICE_LINE]: 4,
        [Items.TYPE.SPRAY]: 5,
        [Items.TYPE.HIGHLIGHT_INTRO]: 6,
        [Items.TYPE.ICON]: 7,
    };

    isShouldComponentUpdate = false;

    modal;

    constructor(props, context, updater) {
        super(props, context, updater);

        const dataSource = new ListView.DataSource({
            sectionHeaderHasChanged: (s1, s2) => {
                return true;
            },
            rowHasChanged: (r1, r2) => {
                if (r1.visible !== r2.visible) {
                    return true;
                }

                return r1.received !== r2.received;
            },
        });

        this.state = {
            data: {},
            dataSource: dataSource,
            visibleSections: [],
            itemsPrice: 0,
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

        this.getItems().map((item) => {
            items[item.uid] = item;
        });

        for (let i in this.state.data) if (this.state.data.hasOwnProperty(i)) {
            for (let j in this.state.data[i]) if (this.state.data[i].hasOwnProperty(j)) {
                if (this.state.data[i][j].received !== items[this.state.data[i][j].uid].received) {
                    this.loadItems();
                    break;
                }
            }
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

    getData() {
        let data = {};

        for (let i in this.state.data) if (this.state.data.hasOwnProperty(i)) {
            data[i] = [];
            this.state.data[i].map((item) => {
                data[i].push(Object.assign({}, item));
            });
        }

        return data;
    }

    loadItems() {
        let data = {}, itemsPrice = 0;

        this.getItems().map((item) => {
            if (!data[ItemsList.sections[item.type]]) {
                data[ItemsList.sections[item.type]] = [];
            }

            if (!item.received) {
                itemsPrice += item.price;
            }

            data[ItemsList.sections[item.type]].push(Object.assign({}, item));
        });

        for (let i in data) if (data.hasOwnProperty(i)) {
            data[i].map((item) => {
                item.name = _(item.name);

                if (this.props.isCollapsible) {
                    item.visible = this.state.visibleSections.indexOf(item.type) !== -1;
                }
            });

            data[i].sort((a, b) => {
                if (a.name === b.name) {
                    return 0;
                }

                return a.name < b.name ? -1 : 1;
            });

            data[i].sort((a, b) => {
                if (a.event === b.event) {
                    return 0;
                }

                return a.event < b.event ? -1 : 1;
            });

            data[i].sort((a, b) => {
                if (a.rarity === b.rarity) {
                    return 0;
                }

                return a.rarity < b.rarity ? 1 : -1;
            });

            data[i].sort((a, b) => {
                if (a.default === b.default) {
                    return 0;
                }

                return a.default < b.default ? 1 : -1;
            });
        }

        this.isShouldComponentUpdate = true;

        this.setState({
            data: data,
            dataSource: this.state.dataSource.cloneWithRowsAndSections(data),
            itemsPrice: itemsPrice,
        });
    }

    onSectionHeaderPress(sectionID) {
        let data = this.getData(),
            visibleSections = this.state.visibleSections;

        sectionID = parseInt(sectionID);

        if (visibleSections.indexOf(sectionID) !== -1) {
            visibleSections.splice(visibleSections.indexOf(sectionID), 1);
        } else {
            visibleSections.push(sectionID);
        }

        this.setState({
            visibleSections: visibleSections,
        }, () => this.forceUpdate());

        data[sectionID].map((item) => {
            item.visible = !item.visible;
        });

        this.isShouldComponentUpdate = true;

        this.setState({
            data: data,
            dataSource: this.state.dataSource.cloneWithRowsAndSections(data),
            visibleSections: visibleSections,
        });
    }

    onItemCheck(index, item) {
        let data = this.getData(),
            itemsPrice = this.state.itemsPrice;

        data[item.type][index].received = !data[item.type][index].received;

        if (data[item.type][index].received) {
            itemsPrice -= item.price;
        } else {
            itemsPrice += item.price;
        }

        this.isShouldComponentUpdate = true;

        this.setState({
            data: data,
            dataSource: this.state.dataSource.cloneWithRowsAndSections(data),
            itemsPrice: itemsPrice,
        }, () => Items.receiveItem(data[item.type][index].uid, data[item.type][index].received));
    }

    onItemPress(item) {
        if (CONFIG.NETWORK === 'NONE') {
            this.modal.error(item.name, _('NO_INTERNET_CONNECTION'));

            return;
        }

        if (item.type === Items.TYPE.ICON) {
            this.modal.open(item.name, item.source);
        } else {
            CloudStorage.getFileUrl(`items/previews/${item.uid}.png`)
                .then((url) => this.modal.open(item.name, {uri: url,}))
                .catch((error) => this.modal.error(item.name, _('PREVIEW_NOT_FOUND')));
        }
    }

    renderSectionHeader(sectionData, sectionID) {
        let type, progress = {received: 0, total: 0,}, onCollapse = null;

        sectionData.map((item) => {
            if (!type) {
                type = item.type;
            }

            if (item.default) {
                return;
            }

            progress.total++;

            if (item.received || item.default) {
                progress.received++;
            }
        });

        if (this.props.isCollapsible) {
            onCollapse = () => this.onSectionHeaderPress(type);
        }

        return (
            <SectionHeader
                title={_(`ITEMS_TYPE_${type}`)}
                isOpened={this.state.visibleSections.indexOf(parseInt(sectionID)) !== -1}
                onCollapse={onCollapse}
                progress={progress}
            />
        );
    }

    renderItem(rowData, rowID) {
        if ([Items.TYPE.SPRAY, Items.TYPE.ICON,].indexOf(rowData.type) !== -1) {
            return (
                <ImageItem
                    index={parseInt(rowID)}
                    item={rowData}
                    onCheck={(index, item) => this.onItemCheck(index, item)}
                    onLongPress={(index, item) => this.onItemPress(item)}
                    addHeroIcon={this.props.addHeroIcon}
                    addEventIcon={this.props.addEventIcon}
                />
            );
        }

        return (
            <Item
                index={parseInt(rowID)}
                item={rowData}
                onCheck={(index, item) => this.onItemCheck(index, item)}
                onPress={(index, item) => this.onItemPress(item)}
                addHeroIcon={this.props.addHeroIcon}
                addHeroName={this.props.addHeroName}
                addEventIcon={this.props.addEventIcon}
            />
        );
    }

    render() {
        let backgroundHero = null;

        if (this.props.hero) {
            backgroundHero = (<Image source={this.props.hero.background} style={styles.backgroundHero}/>);
        }

        return (
            <View style={styles.container}>
                {backgroundHero}
                <PreviewModal ref={(component) => this.modal = component}/>
                <View style={styles.itemsPrice}>
                    <Text style={styles.itemsPriceTitle}>{this.state.itemsPrice}</Text>
                    <Image source={require('./../assets/credit.png')} style={styles.itemsPriceIcon}/>
                </View>
                <ListView
                    contentContainerStyle={styles.contentContainer}
                    dataSource={this.state.dataSource}
                    initialListSize={1024}
                    renderSectionHeader={(sectionData, sectionID) => this.renderSectionHeader(sectionData, sectionID)}
                    renderRow={(rowData, sectionID, rowID, highlightRow) => this.renderItem(rowData, rowID)}
                />
            </View>
        );
    }
}

const IMAGE_ITEM_GRID_SIZE = 4;
const IMAGE_ITEM_SIZE = Math.round(CONFIG.DIMENSIONS.SCREEN_WIDTH / IMAGE_ITEM_GRID_SIZE) - (6 * 4);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CONFIG.COLORS.DARK_BLUE_OPACITY,
    },
    backgroundHero: {
        position: 'absolute',
        opacity: 0.8,
    },
    itemsPrice: {
        height: 56,
        marginHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    itemsPriceTitle: {
        fontSize: 32,
        marginHorizontal: 8,
        fontFamily: 'BigNoodleToo',
        color: '#FFFFFF',
    },
    itemsPriceIcon: {
        height: 32,
        width: 32,
    },
    sectionHeader: {
        height: 56,
        width: CONFIG.DIMENSIONS.SCREEN_WIDTH,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: CONFIG.COLORS.LIGHT_BLUE_OPACITY,
    },
    sectionHeaderTitle: {
        fontSize: 28,
        fontFamily: 'BigNoodleToo',
        color: '#FFFFFF',
    },
    sectionHeaderProgress: {
        flex: 1,
        margin: 8,
        fontFamily: 'Futura',
        color: CONFIG.COLORS.DARK_BLUE,
    },
    item: {
        height: 48,
        width: CONFIG.DIMENSIONS.SCREEN_WIDTH,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemTouchable: {
        height: 48,
        paddingHorizontal: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
    },
    itemHeroIcon: {
        height: 28,
        width: 28,
        marginHorizontal: 8,
    },
    itemEventIcon: {
        height: 18,
        width: 18,
        marginHorizontal: 8,
        marginVertical: 4,
    },
    itemName: {
        flex: 1,
        marginHorizontal: 8,
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
    imageItem: {
        height: IMAGE_ITEM_SIZE,
        width: IMAGE_ITEM_SIZE,
        margin: 6,
        borderRadius: 6,
        resizeMode: 'contain',
    },
    imageContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    imageItemHeroIcon: {
        height: 28,
        width: 28,
    },
    imageItemEventIcon: {
        height: 20,
        width: 20,
        margin: 4,
    },
    imageItemOpacity: {
        opacity: 0.3,
    },
});

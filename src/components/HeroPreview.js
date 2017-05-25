"use strict";

import React, {Component} from 'react';
import {
    Platform,
    Vibration,
    StyleSheet,
    Modal,
    View,
    ScrollView,
    Image,
    Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CONFIG from './../config';
import _ from './../i18n';
import {
    Tabs,
    Button,
} from './';
import Screen from './../screens/Screen';

class Ability extends Component {
    static propTypes = {
        item: React.PropTypes.object.isRequired,
    };

    static defaultProps = {};

    render() {
        return (
            <View style={styles.ability}>
                <View style={styles.abilityLeft}>
                    <View style={styles.abilityIconContainer}>
                        <Image source={this.props.item.icon} style={styles.abilityIcon}/>
                    </View>
                </View>
                <View style={styles.abilityRight}>
                    <Text style={styles.abilityTitle}>{_(`${this.props.item.code}_TITLE`)}</Text>
                    <Text style={styles.abilityDescription}>{_(`${this.props.item.code}_DESCRIPTION`)}</Text>
                </View>
            </View>
        );
    }
}

class OverviewTab extends Screen {
    static navigationOptions = {
        tabBarLabel: 'HEROES__OVERVIEW',
        tabBarIcon: null,
    };

    render() {
        let item = this.props.screenProps.item,
            difficulty = [],
            abilities = [];

        for (let i = 0; i < item.difficulty; i++) {
            difficulty.push(
                <Icon
                    key={`difficulty-${i}`}
                    name="star"
                    size={28}
                    color={CONFIG.COLORS.LEGENDARY}
                />
            );
        }

        item.abilities.map((ability, index) => {
            abilities.push(
                <Ability key={`ability-${index}`} item={ability}/>
            );
        });

        return (
            <ScrollView style={styles.tab} contentContainerStyle={styles.tabContent}>
                <View style={styles.row}>
                    <View style={{flex: 1,}}>
                        <Text style={styles.label}>{_('HEROES__ROLE')}</Text>
                        <Text style={styles.role}>{_(`HEROES__ROLE_${item.role}`)}</Text>
                    </View>
                    <View>
                        <Text style={styles.label}>{_('HEROES__DIFFICULTY')}</Text>
                        <View style={styles.row}>
                            {difficulty}
                        </View>
                    </View>
                </View>
                <Text style={styles.description}>{_(`${item.code}_DESCRIPTION`)}</Text>
                <View style={styles.separator}/>
                <Text style={styles.label}>{_('HEROES__ABILITIES')}</Text>
                {abilities}
            </ScrollView>
        );
    }
}

class StoryTab extends Screen {
    static navigationOptions = {
        tabBarLabel: 'HEROES__STORY',
        tabBarIcon: null,
    };

    render() {
        let item = this.props.screenProps.item;

        return (
            <ScrollView style={styles.tab} contentContainerStyle={styles.tabContent}>
                <Text style={styles.label}>{_('HEROES__BIOGRAPHY')}</Text>
                <Text style={styles.biography}>
                    {`${_('HEROES__REAL_NAME')}: ${_(`${item.code}_BIOGRAPHY_REAL_NAME`)}, ${_('HEROES__AGE')}: ${_(`${item.code}_BIOGRAPHY_AGE`)}`}
                </Text>
                <Text style={styles.biography}>
                    {`${_('HEROES__OCCUPATION')}: ${_(`${item.code}_BIOGRAPHY_OCCUPATION`)}`}
                </Text>
                <Text style={styles.biography}>
                    {`${_('HEROES__BASE_OF_OPERATIONS')}: ${_(`${item.code}_BIOGRAPHY_BASE_OF_OPERATIONS`)}`}
                </Text>
                <Text style={styles.biography}>
                    {`${_('HEROES__AFFILIATION')}: ${_(`${item.code}_BIOGRAPHY_AFFILIATION`)}`}
                </Text>
                <Text style={styles.quote}>{`"${_(`${item.code}_BIOGRAPHY_QUOTE`)}"`}</Text>
                <Text style={styles.story}>{_(`${item.code}_BIOGRAPHY_STORY`)}</Text>
            </ScrollView>
        );
    }
}

export class HeroPreview extends Component {
    static propTypes = {
        vibration: React.PropTypes.number,
    };

    static defaultProps = {
        vibration: 20,
    };

    static initialState = {
        isVisible: false,
        title: '',
        item: null,
        isLoaded: false,
        messageText: null,
        messageIcon: null,
    };

    constructor(props, context, updater) {
        super(props, context, updater);

        this.state = HeroPreview.initialState;
    }

    vibrate() {
        if (this.props.vibration && !this.state.isVisible) {
            Vibration.vibrate(this.props.vibration);
        }
    }

    close() {
        this.setState(HeroPreview.initialState);
    }

    show(item) {
        this.vibrate();

        this.setState({
            isVisible: true,
            title: item.name,
            item: item,
        });
    }

    render() {
        if (!this.state.item) {
            return null;
        }

        return (
            <Modal
                animationType="slide"
                onRequestClose={() => this.close()}
                transparent={true}
                visible={this.state.isVisible}
            >

                <View style={styles.container}>
                    <Text numberOfLines={1} style={styles.title}>{this.state.title.toUpperCase()}</Text>
                    <View style={styles.content}>
                        <Image source={this.state.item.background} style={styles.background}/>
                        <Tabs
                            items={[OverviewTab, StoryTab,]}
                            screenProps={{item: this.state.item,}}
                        />
                    </View>
                    <View style={styles.footer}>
                        <Button
                            title={_('BUTTON__CLOSE')}
                            icon="close"
                            onPress={() => this.close()}
                        />
                    </View>
                </View>

            </Modal>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CONFIG.COLORS.DARK_BLUE,
    },
    title: {
        textAlign: 'center',
        fontSize: 28,
        fontFamily: 'BigNoodleToo',
        color: CONFIG.COLORS.COMMON,
        ...Platform.select({
            'ios': {
                marginTop: 24,
            },
        }),
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    background: {
        position: 'absolute',
        top: 56,
        opacity: 0.1,
    },
    tab: {
        flex: 1,
    },
    tabContent: {
        paddingHorizontal: 8,
    },
    footer: {
        padding: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator: {
        height: 2,
        marginVertical: 4,
        backgroundColor: CONFIG.COLORS.GRAY_BLUE,
    },
    label: {
        fontSize: 24,
        fontFamily: 'BigNoodleTooOblique',
        color: CONFIG.COLORS.LIGHT_BLUE,
    },
    role: {
        fontSize: 24,
        fontFamily: 'BigNoodleTooOblique',
        color: CONFIG.COLORS.COMMON,
    },
    description: {
        marginVertical: 8,
        paddingLeft: 18,
        paddingVertical: 2,
        borderLeftWidth: 6,
        borderLeftColor: CONFIG.COLORS.LIGHT_BLUE,
        fontSize: 16,
        fontFamily: 'Arial',
        color: CONFIG.COLORS.COMMON,
    },
    ability: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    abilityLeft: {
        flex: 1,
    },
    abilityRight: {
        flex: 4,
    },
    abilityIconContainer: {
        height: 64,
        width: 64,
        padding: 8,
        borderWidth: 1,
        borderColor: CONFIG.COLORS.COMMON,
        borderRadius: 32,
        backgroundColor: CONFIG.COLORS.GRAY_BLUE,
    },
    abilityIcon: {
        flex: 1,
        height: null,
        width: null,
        resizeMode: 'contain',
    },
    abilityTitle: {
        fontSize: 18,
        fontFamily: 'BigNoodleToo',
        color: CONFIG.COLORS.COMMON,
    },
    abilityDescription: {
        fontSize: 14,
        fontFamily: 'Arial',
        color: CONFIG.COLORS.COMMON,
    },
    biography: {
        fontSize: 18,
        fontFamily: 'Arial',
        color: CONFIG.COLORS.COMMON,
    },
    quote: {
        marginVertical: 8,
        fontSize: 32,
        fontFamily: 'BigNoodleTooOblique',
        color: CONFIG.COLORS.LIGHT_BLUE,
    },
    story: {
        fontSize: 18,
        fontFamily: 'Arial',
        color: CONFIG.COLORS.COMMON,
    },
});

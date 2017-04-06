"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import {TabViewAnimated} from 'react-native-tab-view';

import _ from './../l10n';
import Items from './../Items';
import {
    Layout,
    ButtonsGroup,
    HeroesList,
    ItemsList,
} from './../components';
import Scene from './Scene';

export class EventScene extends Scene {
    static propTypes = {
        item: React.PropTypes.object.isRequired,
    };

    static defaultProps = {};

    dontTrackTabPosition = false;

    constructor(props, context, updater) {
        super(props, context, updater);

        this.hardwareBackPress = () => this.navigationPop();

        this.state = {
            items: [],
            index: 0,
            routes: [
                {key: 'by_type', title: _('BY_TYPE'),},
                {key: 'by_heroes', title: _('BY_HEROES'),},
            ],
        };
    }

    onHeroPress(item) {
        let props = {
            title: _(item.code),
            hero: item,
            event: this.props.item,
            isCollapsible: false,
            addHeroIcon: false,
        };

        this.navigator.push({name: 'ItemsScene', props: props,});
    }

    tabRenderHeader() {
        let actions = [];

        this.state.routes.map((item, index) => {
            actions.push({title: item.title, action: () => {
                this.dontTrackTabPosition = true;
                this.setState({
                    index: index,
                }, () => setTimeout(() => this.dontTrackTabPosition = false, 150));
            }, isActive: this.state.index === index,});
        });

        return (
            <View style={styles.filter}>
                <ButtonsGroup items={actions}/>
            </View>
        );
    }

    tabRenderScene({route}) {
        switch (route.key) {
            case 'by_type':
                return (<ItemsList event={this.props.item}/>);
                break;
            case 'by_heroes':
                return (<HeroesList progressEvent={this.props.item} onItemPress={(item, index) => this.onHeroPress(item)}/>);
                break;
        }
    }

    tabHandleChangePosition(position) {
        if (this.dontTrackTabPosition) {
            return;
        }

        this.setState({
            index: Math.round(position),
        });
    }

    onToolbarActionSelected(index) {
        switch (index) {
            case 0:
                this.checkAll();
                break;
        }
    }

    checkAll() {
        Items.select(null, null, null, null, this.props.item.id).map((item) => {
            Items.receiveItem(item.uid, true);
        });

        this.forceUpdate();
    }

    render() {
        return (
            <Layout
                toolbarTitle={_(this.props.item.code)}
                toolbarActions={[
                    {title: _('CHECK_ALL'), iconName: 'check',},
                ]}
                onToolbarIconPress={() => this.navigationPop()}
                onToolbarActionSelected={(index) => this.onToolbarActionSelected(index)}
                background={this.props.item.background}
            >

                <TabViewAnimated
                    navigationState={this.state}
                    renderHeader={() => this.tabRenderHeader()}
                    renderScene={(route) => this.tabRenderScene(route)}
                    onChangePosition={(index) => this.tabHandleChangePosition(index)}
                    onRequestChangeTab={(index) => null}
                    style={styles.tabs}
                />

            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    filter: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabs: {
        flex: 1,
    },
});

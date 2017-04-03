"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
} from 'react-native';

import _ from './../l10n';
import Items from './../Items';
import {
    Layout,
    ItemsList,
} from './../components';
import Scene from './Scene';

export class ItemsScene extends Scene {
    static propTypes = {
        title: React.PropTypes.string.isRequired,
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

    constructor(props, context, updater) {
        super(props, context, updater);

        this.hardwareBackPress = () => this.navigationPop();
    }

    onToolbarActionSelected(index) {
        switch (index) {
            case 0:
                this.checkAll();
                break;
        }
    }

    checkAll() {
        Items.select(
            null,
            this.props.type || null,
            this.props.rarity || null,
            this.props.hero && this.props.hero.id,
            this.props.event && this.props.event.id
        ).map((item) => {
            Items.receiveItem(item.uid, true);
        });

        this.forceUpdate();
    }

    render() {
        return (
            <Layout
                toolbarTitle={this.props.title}
                toolbarActions={[
                    {title: _('CHECK_ALL'), iconName: 'check',},
                ]}
                onToolbarIconPress={() => this.navigationPop()}
                onToolbarActionSelected={(index) => this.onToolbarActionSelected(index)}
                background={this.props.event && this.props.event.background}
            >

                <ItemsList
                    type={this.props.type}
                    rarity={this.props.rarity}
                    hero={this.props.hero}
                    event={this.props.event}
                    isCollapsible={this.props.isCollapsible}
                    addHeroIcon={this.props.addHeroIcon}
                    addHeroName={this.props.addHeroName}
                    addEventIcon={this.props.addEventIcon}
                />

            </Layout>
        );
    }
}

const styles = StyleSheet.create({});

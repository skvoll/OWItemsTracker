"use strict";

import React, {Component} from 'react';
import {
    StyleSheet,
} from 'react-native';

import _ from './../i18n';
import Items from './../Items';
import {
    Layout,
    ItemsList,
} from './../components';
import Screen from './Screen';

export default class ItemsScreen extends Screen {
    params = {
        isCollapsible: true,
        addHeroIcon: true,
        addEventIcon: false,
    };

    constructor(props, context, updater) {
        super(props, context, updater);

        this.params = Object.assign(this.params, this.props.navigation.state.params);

        this.state = {
            title: this.params.title,
            type: this.params.type,
            rarity: this.params.rarity,
            hero: this.params.hero,
            event: this.params.event,
            isCollapsible: this.params.isCollapsible,
            addHeroIcon: this.params.addHeroIcon,
            addEventIcon: this.params.addEventIcon,
        };
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
            this.state.type || null,
            this.state.rarity || null,
            this.state.hero && this.state.hero.id,
            this.state.event && this.state.event.id
        ).map(item => {
            Items.receiveItem(item.uid, true);
        });

        this.forceUpdate();
    }

    render() {
        return (
            <Layout
                toolbarTitle={this.state.title}
                toolbarActions={[
                    {title: _('BUTTON__CHECK_ALL'), iconName: 'check',},
                ]}
                onToolbarIconPress={() => this.application.back()}
                onToolbarActionSelected={index => this.onToolbarActionSelected(index)}
                background={this.state.event && this.state.event.background}
            >

                <ItemsList
                    type={this.state.type}
                    rarity={this.state.rarity}
                    hero={this.state.hero}
                    event={this.state.event}
                    isCollapsible={this.state.isCollapsible}
                    addHeroIcon={this.state.addHeroIcon}
                    addEventIcon={this.state.addEventIcon}
                />

            </Layout>
        );
    }
}

const styles = StyleSheet.create({});

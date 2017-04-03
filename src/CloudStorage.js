"use strict";

import {
    ToastAndroid,
} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import * as firebase from 'firebase';

import CONFIG from './config';
import _ from './l10n';

export default class CloudStorage {
    static instance;
    static storage;
    static database;
    static uid;

    static async initialize() {
        if (this.instance) {
            return;
        }

        try {
            this.instance = firebase.initializeApp(CONFIG.FIREBASE);
            this.storage = this.instance.storage();
        } catch (error) {
            throw error;
        }
    }

    static async authorize() {
        if (!this.instance) {
            await this.initialize();
        }

        if (!CONFIG.CLOUD_SYNCHRONIZATION || CONFIG.NETWORK === 'NONE') {
            return;
        }

        let user;

        try {
            await GoogleSignin.configure(CONFIG.GOOGLE_SIGNIN);
            user = GoogleSignin.currentUser();
            if (!user.hasOwnProperty('idToken')) {
                user = await GoogleSignin.signIn();
            }
        } catch (error) {
            throw error;
        }

        let {uid} = await firebase.auth().signInWithCredential(
            firebase.auth.GoogleAuthProvider.credential(user.idToken)
        );

        this.uid = uid;

        this.database = this.instance.database();
    }

    static save(key, value) {
        if (!CONFIG.CLOUD_SYNCHRONIZATION) {
            return;
        }

        if (!this.database) {
            ToastAndroid.show(_('CLOUD_SYNCHRONIZATION_FAILED'), ToastAndroid.SHORT);

            return;
        }

        let storage = this.database.ref(`users/${this.uid}/${key}`);

        return storage.set(value);
    }

    static async get(key) {
        if (!CONFIG.CLOUD_SYNCHRONIZATION) {
            return;
        }

        if (!this.database) {
            ToastAndroid.show(_('CLOUD_SYNCHRONIZATION_FAILED'), ToastAndroid.SHORT);

            return;
        }

        let snapshot = await this.database.ref(`users/${this.uid}/${key}`).once('value');

        return snapshot.val();
    }

    static remove(key) {
        if (!CONFIG.CLOUD_SYNCHRONIZATION) {
            return;
        }

        if (!this.database) {
            ToastAndroid.show(_('CLOUD_SYNCHRONIZATION_FAILED'), ToastAndroid.SHORT);

            return;
        }

        return this.database.ref(`users/${this.uid}/${key}`).remove();
    }

    static getFileUrl(path) {
        if (!this.storage) {
            ToastAndroid.show(_('STORAGE_CONNECTION_FAILED'), ToastAndroid.SHORT);

            return;
        }

        return this.storage.ref().child(path).getDownloadURL();
    }
}

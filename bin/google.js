"use strict";

const fs = require('fs');
const googleapis = require('googleapis');
const googleAuthLibrary = require('google-auth-library');

const logger = require('./logger');

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets.readonly',
];
const SECRET_PATH = './googleapi.secret.json';
const TOKEN_PATH = './googleapi.token.json';
const I18N_CONFIG_PATH = './googleapi.i18n.json';

function getToken(oauth2Client) {
    return new Promise((resolve, reject) => {
        logger.info('authorization url: ' + oauth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES,
            }));

        logger.question('enter authorization code').then((code) => {
            oauth2Client.getToken(code, (error, token) => {
                if (error) {
                    reject(error);

                    return;
                }

                fs.writeFileSync(TOKEN_PATH, JSON.stringify(token, null, 2));

                oauth2Client.credentials = token;

                resolve(oauth2Client);
            });
        }).catch(reject);
    });
}

function authorization() {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(SECRET_PATH)) {
            reject(`'${SECRET_PATH}' does not exists`);

            return;
        }

        let auth = new googleAuthLibrary(),
            credentials = require(SECRET_PATH),
            oauth2Client = new auth.OAuth2(
                credentials.installed.client_id,
                credentials.installed.client_secret,
                credentials.installed.redirect_uris[0]
            );

        if (!fs.existsSync(TOKEN_PATH)) {
            getToken(oauth2Client).then(resolve).catch(reject);
        } else {
            oauth2Client.credentials = require(TOKEN_PATH);

            resolve(oauth2Client);
        }
    });
}

function getTranslation(auth, spreadsheet, type) {
    return new Promise((resolve, reject) => {
        googleapis.sheets('v4').spreadsheets.values.get({
            auth: auth,
            spreadsheetId: spreadsheet,
            range: `${type}!B2:C`,
        }, function (error, response) {
            if (error) {
                reject(error);

                return;
            }

            resolve(response.values);
        });
    });
}

function getTranslations() {
    return new Promise((resolve, reject) => {
        authorization().then(async (auth) => {
            if (!fs.existsSync(I18N_CONFIG_PATH)) {
                throw new Error(`'${I18N_CONFIG_PATH}' does not exists`);
            }

            let translations = {}, i18n = require(I18N_CONFIG_PATH);

            for (let i in i18n.languages) if (i18n.languages.hasOwnProperty(i)) {
                translations[i18n.languages[i].code] = {};
                for (let j in i18n.types) if (i18n.types.hasOwnProperty(j)) {
                    translations[i18n.languages[i].code][i18n.types[j]] = {};
                    (await getTranslation(auth, i18n.languages[i].spreadsheet, i18n.types[j])).map((item) => {
                        translations[i18n.languages[i].code][i18n.types[j]][item[1]] = item[0];
                    });
                }
            }

            resolve(translations);
        }).catch(reject);
    });
}

module.exports = {
    getTranslations: getTranslations,
};

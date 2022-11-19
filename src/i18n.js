import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import {locales} from './locales'
import * as RNLocalize from 'react-native-localize';

console.log(RNLocalize.getLocales()[0].languageCode);

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: locales,
        fallbackLng: 'en',
        lng: RNLocalize.getLocales()[0].languageCode,
        compatibilityJSON: 'v3'
    });

export default i18n;
import React, {Component, useLayoutEffect} from 'react'
import {Dimensions, Image, Pressable, StyleSheet, Text, View} from "react-native";
import {connect, useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import {saveData} from "../AsyncStorage";
const screen = Dimensions.get("screen");

export default function Language(props) {
    const { t, i18 } = useTranslation();
    const theme = useSelector(state => state.theme)

    return (
        <View style={{flex: 1, backgroundColor: theme.background_b1}}>
            <View style={{ flexDirection: "column"}}>
                <Pressable style={({pressed}) => [styles(theme, pressed).element]}
                           onPress={() => {
                               i18n.changeLanguage('ru')
                               saveData("LANG", 'ru')
                           }}>
                    <Text style={styles(theme).header}>{t('Language:russian')}</Text>
                </Pressable>
                <Pressable style={({pressed}) => [styles(theme, pressed).element]}
                           onPress={() => {
                               i18n.changeLanguage('en')
                               saveData("LANG", 'en')
                           }}>
                    <Text style={styles(theme).header}>{t('Language:english')}</Text>
                </Pressable>
                <Pressable style={({pressed}) => [styles(theme, pressed).element]}
                           onPress={() => {
                               i18n.changeLanguage('sk')
                               saveData("LANG", 'sk')
                           }}>
                    <Text style={styles(theme).header}>{t('Language:sk')}</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = (theme, pressed) => (StyleSheet.create({
    element:{
        flexDirection: "row",
        borderWidth: 0.4,
        borderColor: theme.border_color,
        backgroundColor: pressed? theme.background_b3 : theme.background_b1
    },
    header:{
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 0.02*screen.height,
        marginBottom: 0.02*screen.height,
        marginLeft: 0.1*screen.width,
        color: theme.text_color
    },
}));
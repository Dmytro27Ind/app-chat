import React, {Component, useLayoutEffect} from 'react'
import {Dimensions, Image, Pressable, StyleSheet, Text, View} from "react-native";
import {connect, useSelector} from "react-redux";
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const screen = Dimensions.get("screen");

export default function Settings(props) {
    const theme = useSelector(state => state.theme)
    const { t, i18 } = useTranslation();

    return (
        <View style={{flex: 1, backgroundColor: theme.background_b1}}>
            <View style={{ flexDirection: "column"}}>
                <Pressable style={({pressed}) => [styles(theme, pressed).element]}
                           onPress={() => props.navigation.navigate('Language')}>
                    <Image source={(theme.theme === 'dark')? require("../assets/language_light.png"): require("../assets/language_dark.png")} style={styles(theme).icon} />
                    <Text style={styles(theme).header}>{t('Language:language')}</Text>
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
    icon:{
        height: 0.1*screen.width,
        width: 0.1*screen.width,
        margin: 0.015*screen.height,
        marginLeft: 0.08*screen.width,
        borderRadius: 0.1*screen.width/2,
        //resizeMode: 'cover'
    },
    header:{
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 0.023*screen.height,
        marginLeft: 0.05*screen.width,
        color: theme.text_color
    },
}));
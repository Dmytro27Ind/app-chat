import React, {Component, useLayoutEffect} from 'react'
import {Dimensions, Image, Pressable, StyleSheet, Text, View} from "react-native";
import {connect, useDispatch, useSelector} from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {useTranslation} from "react-i18next";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {authAction} from "../redux/actions/AuthActions";

const screen = Dimensions.get("screen");


export default function MyProfile(props) {
    const { t, i18 } = useTranslation()
    const dispatch = useDispatch()
    const theme = useSelector(state => state.theme)
    const name = useSelector(state => state.auth.name)
    const email = useSelector(state => state.auth.email)
    const photo = useSelector(state => state.auth.photo)
    const id = useSelector(state => state.auth.id)

    const signOut = async () => {
        try {
            await GoogleSignin.signOut();
            await props.navigation.navigate("Login")
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles(theme).chat}>
            <Image source={{uri: photo}} style={styles(theme).ava}/>
            <Text style={{color:theme.text_color, alignSelf: "center", fontSize: 28, flex: 3}}>{name}</Text>
            <Text style={{color:theme.text_color_2, alignSelf: "center", fontSize: 22, flex: 10}}>{email}</Text>

            {/*<Text style={{color:theme.text_color_2, alignSelf: "center", fontSize: 22, flex: 10}}>{id}</Text>*/}

            <Pressable style={({pressed}) => [styles(theme, pressed).singout]}
                       onPress={() => (signOut())}>
                <MaterialCommunityIcons name='logout' size={50} color={theme.text_color} style={{marginLeft: screen.width*0.04}}/>
                <Text style={{color:theme.text_color, alignSelf: "center", fontSize: 24}}>  {t("Singout:singout")}</Text>
            </Pressable>
        </View>
    );
}

const styles = (theme, pressed) => (StyleSheet.create({
    chat:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background_b1
    },
    ava:{
        height: 0.4*screen.width,
        width: 0.4*screen.width,
        margin: 0.05*screen.height,
        borderRadius: 0.4*screen.width/2,
    },
    singout:{
        flexDirection: "row",
        borderWidth: 0.4,
        borderColor: theme.border_color,
        backgroundColor: pressed? theme.background_b3 : theme.background_b2,
        marginBottom: screen.height*0.07,
        borderRadius: 15,
        width: screen.width*0.5
    },
}));
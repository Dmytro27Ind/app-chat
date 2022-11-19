import React, {useState} from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import {Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AllChats from "../screens/AllChats";
import DrawerPaper from "../screens/DrawerContent";
import {connect, useSelector} from "react-redux";
import Settings from "../screens/Settings";
import MyProfile from "../screens/MyProfile";
import Language from "../screens/Language";
import {useTranslation} from "react-i18next";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AddNewChat from "../screens/AddNewChat";

const Drawer = createDrawerNavigator();
const screen = Dimensions.get("screen");

export default function DrawerNavigation(props){
    const { t, i18 } = useTranslation();
    const theme = useSelector(state => state.theme)

    return(
        <Drawer.Navigator
            screenOptions={{
                headerStyle:{backgroundColor: theme.background_b2},
                headerTintColor: theme.text_color,
                drawerStyle: {backgroundColor: theme.background_b1, width: screen.width*0.7},
                drawerActiveTintColor: theme.text_color,
            }}
            drawerContent={props => <DrawerPaper {...props} />}
        >
            <Drawer.Screen name="All Chats" component={AllChats} options={{headerTitle: t('AllChats:allChats'), headerRight: () => addNewUser(theme, props)}}/>
            <Drawer.Screen name="Settings" component={Settings} options={{headerTitle: t('Settings:settings')}}/>
            <Drawer.Screen name="My Profile" component={MyProfile} options={{headerTitle: t('Profile:profile')}}/>
            <Drawer.Screen name="Language" component={Language} options={{headerTitle: t('Language:language')}}/>
            <Drawer.Screen name="New Chat" component={AddNewChat} options={{headerShown: false}}/>
            {/*<Drawer.Screen name="All Chats2" component={AllChats} options={{headerRight: () => search()}}/>*/}
        </Drawer.Navigator>
    );
}

function addNewUser(theme, props){
    return <TouchableOpacity onPress={() => {
        props.navigation.navigate("New Chat")
    }}>
        <MaterialCommunityIcons name='account-plus' size={35} color={theme.text_color} style={{marginLeft:0.02*screen.width, marginRight: 0.02*screen.width}}/>
    </TouchableOpacity>
}

const styles = StyleSheet.create({
    search:{
        width: 0.08*screen.width,
        height: 0.08*screen.width,
        marginRight: 0.04*screen.width
    }
});
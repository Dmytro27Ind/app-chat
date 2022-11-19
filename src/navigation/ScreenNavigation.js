import React, {useEffect, useState} from "react";
import {Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, Dimensions} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Chat from "../screens/Chat";
import DrawerNavigation from "./DrawerNavigation";
import {connect, useSelector} from "react-redux";
import Login from "../screens/Login";

const Stack = createNativeStackNavigator();
const screen = Dimensions.get("screen");

export default function ScreenNavigation(props){
    const theme = useSelector(state => state.theme)

    return (
        <>
            <StatusBar backgroundColor={theme.background_b2}/>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{headerStyle:{backgroundColor: theme.background_b2}, headerTintColor: theme.text_color}}>
                    <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
                    <Stack.Screen name="Drawer" component={DrawerNavigation} options={{headerShown: false}}/>
                    <Stack.Screen name="Chat" component={Chat} options={
                        ({route}) => ({headerTitle: () => <ChatTitle name={route.params.name} ava={route.params.ava} theme={theme} uid={route.params.uid}/>})
                    }/>
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

function ChatTitle(props){
    const [location, setLocation] = useState()

    useEffect(() => {
        async function fetchData(){
            const response = await fetch("https://messaging-heroku.herokuapp.com/api/location/" + props.uid, {
                method: "GET",
                headers: { "Accept": "application/json" }
            });
            let get_location
            if (response.ok === true) {
                try{
                    get_location = await response.json();
                    console.log('ScreenNavigation location already true')
                    console.log("ScreenNavigation get_location: " + get_location?.location)
                    setLocation(get_location.location)
                }
                catch (error){
                    console.log('ScreenNavigation location error')
                    console.log("ScreenNavigation get_location: " + get_location?.location)
                    console.log(error)
                    setLocation("undefined location")
                }
            }
        }
        fetchData()
    },[])

    return(
        <View style={{ flexDirection: "row"}}>
            <TouchableOpacity>
                <Image source={{uri: props.ava}} style={styles(props.theme).ava}/>
            </TouchableOpacity>
            <View>
                <Text style={styles(props.theme).chatTitle}>{props.name}</Text>
                <Text style={styles(props.theme).location}>{location}</Text>
            </View>
        </View>
    );
}

const styles = (theme) => (StyleSheet.create({
    ava:{
        height: 0.14*screen.width,
        width: 0.14*screen.width,
        borderRadius: 0.14*screen.width/2,
        marginTop: 0.008*screen.height,
        marginBottom: 0.006*screen.height
    },
    chatSettings:{
        height: 0.05*screen.width,
        width: 0.05*screen.width,
        borderRadius: 0.05*screen.width/2,
        marginTop: 0.032*screen.height,
        marginLeft: 0.37*screen.width
    },
    chatTitle:{
        fontSize: 19,
        color: theme.text_color,
        fontWeight: "bold",
        marginLeft: 0.03*screen.width,
        marginTop: 0.01*screen.height
    },
    location:{
        fontSize: 16,
        color: theme.text_color_2,
        fontWeight: "bold",
        marginLeft: 0.03*screen.width,
        marginTop: 0.003*screen.height
    }
}));
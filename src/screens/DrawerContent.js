import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Image, Switch} from "react-native";
import {DrawerItem} from "@react-navigation/drawer";
import {Text} from 'react-native-paper';
import DrawerSection from "react-native-paper/src/components/Drawer/DrawerSection";
import {connect, useDispatch, useSelector} from "react-redux";
import {switchTheme} from "../redux/actions/ThemeActions";
import {useTranslation} from "react-i18next";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {allUsers} from "../redux/actions/AllUsersActions";
import {loadData, saveData} from "../AsyncStorage";

const screen = Dimensions.get("screen");

export default function DrawerContent(props){
    const theme = useSelector(state => state.theme)
    const name = useSelector(state => state.auth.name)
    const email = useSelector(state => state.auth.email)
    const photo = useSelector(state => state.auth.photo)
    const dispatch = useDispatch()
    const { t, i18 } = useTranslation();
    const [isEnabled, setIsEnabled] = useState(false);
    const allUsersID = useSelector(state => state.allReducer.id)

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
        dispatch(switchTheme())
        if(isEnabled){
            saveData("THEME", 'dark')
        }else{
            saveData("THEME", 'light')
        }
        loadData("THEME").then((theme) => {
            console.log("THEME drawerContent: " + theme)
        })
        // new
        let temp = []
        for(let i=0; i<allUsersID.length; i++){
            temp.push(allUsersID[i])
            console.log("drawer for(): " + allUsersID[i])
        }
        temp.push(undefined)
        console.log("all + undefined: " + temp)
        dispatch(allUsers(temp))
    };

    useEffect(() => {
        console.log("name: " + name)
        console.log("email: " + email)
        console.log("photo: " + photo)
    }, [name, email, photo])


    return(
        <View style={{flex:1}}>
            <View style={styles(theme).profile}>
                <Image source={{uri: photo}} style={styles(theme).ava}/>
                <Text style={{fontSize: 17, color: theme.text_color, marginTop: 0.07*screen.height}}>{name}</Text>
            </View>
            <View style={{flex: 6}}>
                <PaperSection name={t("Profile:profile")} theme={theme}
                              icon={(theme.theme === 'dark')? require("../assets/profile_light.png") : require("../assets/profile_dark.png")}
                              navigation={props.navigation} t={t}/>
                <PaperSection theme={theme} name={t("Settings:settings")}
                              icon={(theme.theme === 'dark')? require("../assets/settings_light.png") : require("../assets/settings_dark.png")}
                              navigation={props.navigation} t={t}/>
                <PaperSection theme={theme} name={t("Singout:singout")}
                              icon={(theme.theme === 'dark')? require("../assets/sing_out_light.png") : require("../assets/sing_out_dark.png")}
                              navigation={props.navigation} t={t}/>
            </View>
            <View style={{marginRight:0.2*screen.width, flex: 1}}>
                <Switch
                    trackColor={{ false: "#767577", true: "#b2beb7" }}
                    thumbColor={theme.background_b2}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                    style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                />
            </View>
        </View>
    );
}

function PaperSection(props){
    const onPress = () => {
        switch(props.name){
            case props.t("Settings:settings"):
                props.navigation.navigate('Settings')
                break;
            case props.t("Profile:profile"):
                props.navigation.navigate('My Profile')
                break;
            case props.t("Singout:singout"):
                const singOut = async () => {
                    try {
                        await GoogleSignin.signOut();
                        await props.navigation.navigate("Login")
                    } catch (error) {
                        console.error(error);
                    }
                }
                singOut()
                break;
            default:
                alert(props.name);
        }
    }
    return (
        <DrawerSection style={styles.section}>
            <DrawerItem label={props.name} onPress={() => onPress()}
                icon={({color, size}) => (
                    <Image source={props.icon} style={{height: 0.055*screen.width, width: 0.055*screen.width, marginLeft: 0.055*screen.width}}/>
                )}
                activeTintColor= {props.theme.text_color}
                inactiveTintColor= {props.theme.text_color}
                labelStyle={{fontSize: 16}}
            />
        </DrawerSection>
    );
}

const styles = (theme) => { return StyleSheet.create({
    profile:{
        flexDirection: "row",
        backgroundColor: theme.background_b2
    },
    ava:{
        height: 0.2*screen.width,
        width: 0.2*screen.width,
        margin: 0.03*screen.height,
        borderRadius: 0.2*screen.width/2,
    },
    section:{}
})};
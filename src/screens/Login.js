import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View, TouchableOpacity, Dimensions,} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {connect, useDispatch, useSelector} from "react-redux";
const screen = Dimensions.get("screen");
import GeoLocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';
import Geocoder from 'react-native-geocoding';
import i18n from 'i18next';


import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import {authAction, switchTheme} from "../redux/actions/Actions";
import {loadData, saveData} from "../AsyncStorage";
import {useTranslation} from "react-i18next";


export default function Login(props) {
    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [photo, setPhoto] = useState()
    const [id, setId] = useState()
    const [singin, setSingin] = useState()
    const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()
    const { t, i18 } = useTranslation();

    async function requestLocationPermission()
    {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")
            } else {
                console.log("location permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }

    const getDeviceCurrentLocation = async () => {
        return new Promise((resolve, reject) =>
            GeoLocation.getCurrentPosition(
                (position) => {
                    resolve(position);
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true, // Whether to use high accuracy mode or not
                    timeout: 15000, // Request timeout
                    maximumAge: 10000 // How long previous location will be cached
                }
            )
        );
    };

    useEffect(() => {
        async function fetchData(){
            GoogleSignin.configure({
                scopes: ['https://www.googleapis.com/auth/drive.readonly'], // [Android] what API you want to access on behalf of the user, default is email and profile
                webClientId: '915111781376-u6u6nseqsbk99eom45jalhs65aq8b2l5.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
                offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
                // hostedDomain: '', // specifies a hosted domain restriction
                forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
                // accountName: '', // [Android] specifies an account name on the device that should be used
                // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
                // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
                // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
                // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
            });
            await requestLocationPermission()
        }
        fetchData()

        // if(loadData("LANG") != null)
        //     i18n.changeLanguage(loadData("LANG"))
        loadData("LANG").then((lang) => {
            console.log("loadData LANG: " + lang)
            if(lang != null)
                i18n.changeLanguage(lang)
        })

        loadData("THEME").then((theme) => {
            console.log("THEME: " + theme)
            switch(theme){
                case 'dark':
                    break;
                case 'light':
                    dispatch(switchTheme())
                    break;
                case null:
                    break;
            }
        })

    }, [])

    const prepBeforeLogin = function(){
        dispatch(authAction(name, email, photo, id))
        if(name && email && photo && id){
            getDeviceCurrentLocation().then((location) => {
                console.log(location)
                Geocoder.init("AIzaSyDOmh4GAnRFZ2rQ9wrloMRQ69reZx1acVE");
                Geocoder.from({latitude: location.coords.latitude, longitude: location.coords.longitude}).then(async (loc) => {
                    console.log(loc.results[0].address_components[2].short_name)
                    const response = await fetch("https://messaging-heroku.herokuapp.com/api/location/" + id, {
                        method: "GET",
                        headers: { "Accept": "application/json" }
                    });
                    let get_location
                    if (response.ok === true) {
                        try{
                            get_location = await response.json();
                            console.log('location already true')
                            console.log("get_location: " + get_location)
                        }
                        catch (error){
                            console.log('location error')
                            console.log("get_location: " + get_location)
                            console.log(error)
                        }
                    }
                    if(get_location === undefined){
                        await fetch("https://messaging-heroku.herokuapp.com/api/location", {
                            method: "POST",
                            headers: { "Accept": "application/json", "Content-Type": "application/json" },
                            body: JSON.stringify({
                                id: id,
                                location: loc.results[0].address_components[2].short_name
                            })
                        });
                    }
                })
            })

            props.navigation.navigate('Drawer')
        }
    }

    useEffect(() => {
        prepBeforeLogin()
    }, [name, email, photo, id])

    useEffect( function(){
        async function fetchData(){
            const isSignedIn = await GoogleSignin.isSignedIn();
            if(isSignedIn){
                await loadData("USER").then(async (user) => {
                    setName(user[0])
                    setEmail(user[1])
                    setPhoto(user[2])
                    setId(user[3])
                    console.log("USER load: " + user)
                    console.log(user)
                    console.log(name)
                })
            }
        }
        fetchData()
    }, []);

    const signIn = async () => {
        try {
            await GoogleSignin.hasPlayServices().then(async function (){
                const {user} = await GoogleSignin.signIn();
                await saveData("USER", [user.name, user.email, user.photo, user.id])
                await setName(user.name)
                await setEmail(user.email)
                await setPhoto(user.photo)
                await setId(user.id)
                return user
            }).then(async function (user){
                const response = await fetch("https://messaging-heroku.herokuapp.com/api/users/" + user.id, {
                    method: "GET",
                    headers: { "Accept": "application/json" }
                });
                if (response.ok === true) {
                    let get_user
                    try{
                        get_user = await response.json();
                        console.log('true')
                        console.log(get_user)
                    }
                    catch (error){
                        console.log('false')
                        console.log(get_user)
                        const new_user = async function(user){
                            console.log(user)
                            await fetch("https://messaging-heroku.herokuapp.com/api/users", {
                                method: "POST",
                                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    photo: user.photo
                                })
                            });
                        }
                        await new_user(user)
                    }
                }
            })
        } catch (error) {
            console.log({error})
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
            } else {
                // some other error happened
            }
        }
    };

    return (
        <View style={styles(theme).container}>
            <View style={styles(theme).container}>
                <Text style={styles(theme).header}>Messaging</Text>
                <View style={styles(theme).icon}>
                    <MaterialCommunityIcons name='cellphone-message' size={150} color={theme.text_color} style={{marginLeft:0.135*screen.width, marginTop:0.085*screen.width}}/>
                </View>
                <TouchableOpacity
                    style={styles(theme).loginButton}
                    onPress={() => {signIn()}}
                >
                    <MaterialCommunityIcons name='google' size={40} color={theme.text_color} style={{marginLeft:0.02*screen.width}}/>
                    <Text style={styles(theme).logintext}>{t('Login:login')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = (theme) => (StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background_b1,
    },
    icon: {
        borderRadius: 0.6*screen.width / 2,
        marginTop: screen.height*0.17,
        marginLeft: screen.width*0.2,
        backgroundColor: theme.background_b2,
        width: 0.6*screen.width,
        height: 0.6*screen.width,
    },
    header:{
        fontWeight: "800",
        fontSize: 36,
        color: theme.text_color,
        marginTop: screen.height*0.08,
        marginLeft: screen.width*0.25
    },
    logintext:{
        fontSize: 28,
        color: theme.text_color,
        alignSelf: 'center',
        marginLeft: screen.width*0.09
    },
    loginButton: {
        flexDirection: "row",
        width: screen.width * 0.55,
        alignSelf: "center" ,
        borderWidth: 0.18,
        borderColor: "white",
        marginTop: screen.height * 0.17,
        backgroundColor: theme.background_b3,
        borderRadius: 5
    },
    continue:{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.background_b3,
        alignitems: "center",
        justifyContent: "center"
    }
}));
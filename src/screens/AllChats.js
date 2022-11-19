import {Button, StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, Pressable, ScrollView} from "react-native";
import React, {useState, useEffect, useRef} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {use} from "i18next";
import {allUsers} from "../redux/actions/Actions";

const screen = Dimensions.get("screen");

export default function AllChats(props) {
    const [dimensions, setDimensions] = useState(screen);
    const theme = useSelector(state => state.theme)
    const id = useSelector(state => state.auth.id)
    const allUsersID = useSelector(state => state.allReducer.id)
    //const [usersID, setUsersID] = useState()
    const usersID = useRef()
    const dispatch = useDispatch()
    // const [users, setUsers] = useState()
    const users = useRef()
    const [last, setLast] = useState()
    const [chats, setChats] = useState()

    useEffect(() => {
        async function fetchData() {
            if (id !== undefined) {
                let u = null
                const response = await fetch("https://messaging-heroku.herokuapp.com/api/messages/" + id, {
                    method: "GET",
                    headers: {"Accept": "application/json"}
                });
                if (response.ok === true) {
                    let get_messages
                    try {
                        get_messages = await response.json();
                        console.log('true tuu')
                        console.log("get_messages:")
                        console.log(get_messages)

                        let users_array = []
                        for(let i=0; i<get_messages.length; i++){
                            users_array.push(get_messages[i].with_id)
                        }
                        usersID.current = users_array
                        console.log(usersID.current)

                        // new
                        dispatch(allUsers(users_array))
                        console.log("redux AllChats allUsersID: " + allUsersID)

                        let mess_list = []
                        for(let i=0; i<get_messages.length; i++){
                            mess_list.push(get_messages[i].messages[get_messages[i].messages.length - 1].message)
                        }
                        console.log(mess_list)
                        setLast(mess_list)
                    } catch (error) {
                        console.log(error)
                        console.log('false no messages tuuuu')
                        console.log(get_messages[0].messages)
                    }
                }
            }
        }
        fetchData()
    }, [id])

    useEffect(() => {
        async function fetchData(){
            if(allUsersID !== undefined) {
                let us = []
                for (let i = 0; i < allUsersID.length; i++) {
                    console.log("setTempUser: users -> " + allUsersID)
                    const response = await fetch("https://messaging-heroku.herokuapp.com/api/users/" + allUsersID[i], {
                        method: "GET",
                        headers: {"Accept": "application/json"}
                    });
                    if (response.ok === true) {
                        try {
                            us.push(await response.json());
                            console.log("users === " + us)
                        } catch (error) {
                            console.log("useEffect users all chat:" + error)
                        }
                    }
                }
                users.current = us;
                getAllChats()
            }
        }
        fetchData()
    }, [allUsersID])

    const getAllChats = function (){
        let ch = []

        if(allUsersID !== undefined){
            for(let i=0; i<allUsersID.length; i++){
                if(users.current !== undefined && users.current[i] !== undefined){
                    ch.push(
                        <Pressable key={Math.random()*1000} style={({pressed}) => [styles(theme, pressed).message]}
                                   onPress={() => props.navigation.navigate('Chat', {name: users.current[i]?.name, ava: users.current[i]?.photo, uid:users.current[i]?.id})}>
                            <Image source={{uri: users.current[i]?.photo}} style={styles(theme).ava} />
                            <View style={{flexDirection: "column"}}>
                                <Text style={styles(theme).mheader}>{users.current[i]?.name}</Text>
                                <Text style={styles(theme).mtext}>{(last !== undefined)? last[i] : " "}</Text>
                            </View>
                        </Pressable>
                    )
                }
            }
        }
        if(last === undefined){
            // new
            let temp = []
            for(let i=0; i<allUsersID.length; i++){
                temp.push(allUsersID[i])
                console.log("add new for(): " + allUsersID[i])
            }
            temp.push(undefined)
            console.log("all + undefined 2: " + temp)
            dispatch(allUsers(temp))
        }

        console.log("chats: " + ch)
        setChats(ch)
        console.log("chatsss: " + chats)
    }

    return (
        <View style={{backgroundColor: theme.background_b1, flex: 1}}>
            <ScrollView>
                <View style={{ flexDirection: "column"}}>
                    {/*<Pressable style={({pressed}) => [styles(theme, pressed).message]}*/}
                    {/*           onPress={() => props.navigation.navigate('Chat', {name: "Тамара", ava: "https://lh3.googleusercontent.com/a/AATXAJxV7ghQC5T5dA58JXHm8DsTDr8BVj3VbeDwDK8c=s96-c", uid:"101492483346577314218"})}>*/}
                    {/*    <Image source={{uri: "https://lh3.googleusercontent.com/a/AATXAJxV7ghQC5T5dA58JXHm8DsTDr8BVj3VbeDwDK8c=s96-c"}} style={styles(theme).ava} />*/}
                    {/*    <View style={{flexDirection: "column"}}>*/}
                    {/*        <Text style={styles(theme).mheader}>Тамара</Text>*/}
                    {/*        /!*{getLastMessage(id, "101492483346577314218")}*!/*/}
                    {/*        <Text style={styles(theme).mtext}>{(last !== undefined)? last[0] : " "}</Text>*/}
                    {/*    </View>*/}
                    {/*</Pressable>*/}
                    {/*<Pressable style={({pressed}) => [styles(theme, pressed).message]}*/}
                    {/*           onPress={() => props.navigation.navigate('Chat', {name: "Dmytro", ava: "https://lh3.googleusercontent.com/a/AATXAJzGZN9Sw89YRuTnhd0yL0DY3iQ6j1bqmAbnVc2y=s96-c", uid: "116658254520299498346"})}>*/}
                    {/*    <Image source={{uri: "https://lh3.googleusercontent.com/a/AATXAJzGZN9Sw89YRuTnhd0yL0DY3iQ6j1bqmAbnVc2y=s96-c"}} style={styles(theme).ava} />*/}
                    {/*    <View style={{flexDirection: "column"}}>*/}
                    {/*        <Text style={styles(theme).mheader}>Dmytro</Text>*/}
                    {/*        /!*<Text style={styles(theme).mtext}>Hello man...</Text>*!/*/}
                    {/*        <Text style={styles(theme).mtext}>{(last !== undefined)? last[1] : " "}</Text>*/}
                    {/*    </View>*/}
                    {/*</Pressable>*/}
                    {chats}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = (theme, pressed) => (StyleSheet.create({
    message:{
        flexDirection: "row",
        borderWidth: 0.4,
        borderColor: theme.border_color,
        backgroundColor: pressed? theme.background_b3 : theme.background_b1
    },
    ava:{
        height: 0.165*screen.width,
        width: 0.165*screen.width,
        margin: 0.015*screen.height,
        borderRadius: 0.165*screen.width/2,
    },
    mheader:{
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 0.015*screen.height,
        color: theme.text_color
    },
    mtext:{
        fontSize: 15,
        marginTop: 0.008*screen.height,
        color: theme.text_color_2
    }
}));
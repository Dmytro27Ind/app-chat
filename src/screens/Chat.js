import React, {Component, useEffect, useLayoutEffect, useRef} from 'react'
import {Dimensions, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {connect, useSelector} from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import {GoogleSignin} from "@react-native-google-signin/google-signin";


const screen = Dimensions.get("screen");

export default function Chat(props) {
    const theme = useSelector(state => state.theme)
    const {name, uid} = props.route.params;
    const [text, onChangeText] = React.useState(null);
    const [message, setMessage] = React.useState();
    const [messages, setMessages] = React.useState();
    const scrollRef = useRef();
    const textInput = useRef();
    const id = useSelector(state => state.auth.id)

    useEffect(() => {
        async function fetchData() {
            setInterval(async () => {
                const response = await fetch("https://messaging-heroku.herokuapp.com/api/messages/" + id + "/" + uid, {
                    method: "GET",
                    headers: { "Accept": "application/json" }
                });
                if (response.ok === true) {
                    let get_messages
                    try{
                        get_messages = await response.json();
                        console.log('true')
                        console.log(get_messages.messages)
                        await setMessages(get_messages.messages)
                        console.log("MESSAGES:" + messages)
                    }
                    catch (error){
                        console.log('false no messages')
                        console.log(get_messages.messages)
                    }
                }
            }, 1000);
        }
        fetchData()
    }, [])

    const sendMessage = async function(){
        setMessage(text)
        await fetch("https://messaging-heroku.herokuapp.com/api/messages", {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify({
                id: id,
                with_id: uid,
                messages: [{
                    id: id,
                    message: text
                }]
            })
        }).then(async () => {
            await fetch("https://messaging-heroku.herokuapp.com/api/messages", {
                method: "POST",
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: uid,
                    with_id: id,
                    messages: [{
                        id: id,
                        message: text
                    }]
                })
            })
        }).then(() => {
            textInput.current?.clear()
        });
    }

    function messages_list(){
        let mess_list = []
        if(messages != undefined)
            for(let i=0; i<messages.length; i++){
                let length = messages[i]?.message?.length;
                if(length === undefined)
                    length = 2
                console.log("textlen: " + length)
                mess_list.push(
                    <View style={{marginTop: "2%",
                        width: screen.width*0.7 * ((length<=18)?length/18:1) + 45,
                        height: screen.height*0.115 * ((length>=30)? ((length/60 >= 1)?length/60:1) :1),
                        borderRadius: 10,
                        backgroundColor: (messages[i].id === id)? theme.background_b3 : theme.background_b2,
                        flexDirection: 'row',
                        marginLeft: (messages[i].id === id)? 'auto' : 0}}
                    >
                        <Text style={{color:theme.text_color, fontSize: 16, padding: 15}}>{messages[i].message}</Text>
                    </View>
                )
            }
        return (
            mess_list
        )
    }
    return (
        <>
            <ScrollView style={{backgroundColor: theme.background_b1}}
                        nestedScrollEnabled = {true}
                        showsVerticalScrollIndicator = {true}
                        ref={scrollRef}
                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
                >
                {messages_list()}
            </ScrollView>
            <View style={{flexDirection: "row", backgroundColor: theme.background_b1}}>
                <TextInput
                    style={{backgroundColor: theme.background_b3, marginTop: "3%", color: theme.text_color, width: screen.width*0.85, height: screen.height*0.07}}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder="Message"
                    placeholderTextColor={theme.text_color_2}
                    returnKeyType="send"
                    onSubmitEditing={() => sendMessage()}
                    ref={textInput}
                />
                <TouchableOpacity style={{width: screen.width*0.15, height: screen.height*0.07, marginTop: "3%", padding: 6, backgroundColor: theme.background_b3}}
                                  onPress = {
                                      () => sendMessage()
                                  }>
                    <MaterialCommunityIcons name='send' size={30} color={theme.text_color_2}/>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = (theme) => (StyleSheet.create({
    chat:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.background_b1
    },
    container: {
        flex: 1,
        marginTop:60,
        marginBottom:50,
        backgroundColor: "#000"
    },
    listView: {
        flex: 2,
        padding: 10,
    },
    newInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
        padding:10,
        height:50,
    },
    messageRow: {
        alignItems:'flex-start',
        marginBottom:5,
    },
    meRow: {
        alignItems:'flex-end'
    },
    messageContent: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 10,
        borderRadius:10,
        backgroundColor:'#ebebeb',
    },
    me: {
        alignItems: 'flex-end',
        backgroundColor:'#d2fffd',
    },
    message: {
        fontSize: 16,
        color: '#888'
    },
    messageDate: {
        fontSize: 12,
        color: '#656565',
        padding:2,
    },
    text: {
        color:'#000',
    },
}));
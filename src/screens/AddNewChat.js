import React, {useRef} from 'react';
import {Dimensions, Text, TextInput, View} from "react-native";
import {connect, useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {Alert} from "react-native";
import {allUsers} from "../redux/actions/AllUsersActions";


const screen = Dimensions.get("screen");

export default function AddNewChat(){
    const { t, i18 } = useTranslation()
    const theme = useSelector(state => state.theme)
    const [text, onChangeText] = React.useState(null);
    const textInput = useRef();
    const id = useSelector(state => state.auth.id)
    const dispatch = useDispatch()
    const allUsersID = useSelector(state => state.allReducer.id)

    const sendMessage = async function(){
        console.log(text)
        textInput.current?.clear()

        const response = await fetch("https://messaging-heroku.herokuapp.com/api/users/email/" + text, {
            method: "GET",
            headers: {"Accept": "application/json"}
        });
        if (response.ok === true) {
            try {
                let user = await response.json();
                console.log("add new: users = " + user)
                console.log(user)

                await fetch("https://messaging-heroku.herokuapp.com/api/messages", {
                    method: "POST",
                    headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: id,
                        with_id: user.id,
                        messages: [{
                            id: id,
                            message: "Hello, " + user.name
                        }]
                    })
                }).then(async () => {
                    await fetch("https://messaging-heroku.herokuapp.com/api/messages", {
                        method: "POST",
                        headers: { "Accept": "application/json", "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: user.id,
                            with_id: id,
                            messages: [{
                                id: id,
                                message: "Hello, " + user.name
                            }]
                        })
                    })
                })

                // new
                let temp = []
                for(let i=0; i<allUsersID.length; i++){
                    temp.push(allUsersID[i])
                    console.log("add new for(): " + allUsersID[i])
                }
                temp.push(user.id)
                console.log("all + user: " + temp)
                dispatch(allUsers(temp))
                console.log("redux AllChats allUsersID + new user: " + allUsersID)

            } catch (error) {
                console.log("add new user sendMessage:" + error)
                Alert.alert("Add new user", "This user does not use this application")
            }
        }
    }

    return (
        <View style={{backgroundColor: theme.background_b1, flex: 1}}>
            <TextInput
                style={{backgroundColor: theme.background_b3, marginTop: screen.height*0.43, color: theme.text_color, width: screen.width, height: screen.height*0.1, fontSize: 19, borderRadius: 4}}
                onChangeText={onChangeText}
                value={text}
                placeholder="User email"
                placeholderTextColor={theme.text_color_2}
                returnKeyType="send"
                onSubmitEditing={() => sendMessage()}
                ref={textInput}
            />
        </View>
    )
}
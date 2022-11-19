import React,{} from 'react';
import {Provider} from "react-redux";
import ScreenNavigation from "./navigation/ScreenNavigation";
import './i18n';
import store from "./redux/store";

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function App(){
    return (
        <Provider store={store}>
            <ScreenNavigation/>
        </Provider>
    )
}
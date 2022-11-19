import {combineReducers} from "redux";
import themeReducer from "./ThemeReducer";
import auth from "./AuthReducer";
import allReducer from "./AllUsersReducer";

const allRedusers = combineReducers({
    theme: themeReducer,
    auth: auth,
    allReducer: allReducer
});

export default allRedusers;
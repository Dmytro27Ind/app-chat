import {createStore} from "redux";
import allRedusers from "./reducers/allRedusers";

const store = createStore(allRedusers)

export default store
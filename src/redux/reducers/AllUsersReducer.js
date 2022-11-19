import {ALLUSERS} from "../actions/Constants";

let initialState = {
    id: [undefined]
}

const allReducer = (state = initialState, action) => {
    switch (action.type) {
        case ALLUSERS:
            return {id: action.id};
        default:
            return state;
    }
};

export default allReducer;
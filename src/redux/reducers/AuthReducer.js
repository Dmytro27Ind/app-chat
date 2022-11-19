import {AUTH} from "../actions/Constants";

let initialState = {
    name: "initial user state",
    email: "initial@mail.com",
    photo: "initial url photo"
}

const auth = (state = initialState, action) => {
    switch (action.type) {
        case AUTH:
            return {name: action.name, email: action.email, photo: action.photo, id: action.id};
        default:
            return state;
    }
};

export default auth;
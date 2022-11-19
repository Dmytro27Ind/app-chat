import {AUTH} from "./Constants";

export const authAction = (name, email, photo, id) => {
    return{
        type: AUTH,
        name: name,
        email: email,
        photo: photo,
        id: id
    };
}
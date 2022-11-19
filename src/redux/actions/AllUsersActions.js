import {ALLUSERS} from "./Constants";

export const allUsers = (id) => {
    return{
        type: ALLUSERS,
        id: id
    };
}
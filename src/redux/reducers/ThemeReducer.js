import {SWITCH_THEME} from "../actions/Constants";

const DARK_THEME = {
    theme: 'dark',
    background_b1: "#111010",
    background_b2: "#2a2a2d",
    background_b3: "#37373b",
    text_color: '#f6f6f6',
    text_color_2: '#9f9f9f',
    border_color: '#232324'
}

const LIGHT_THEME = {
    theme: 'light',
    background_b1: "#f7fff7",
    background_b2: "#8bbc8d",
    background_b3: "#ddffe0",
    text_color: '#222222',
    text_color_2: '#545454',
    border_color: '#9b9bc4'
}

const themeReducer = (state = DARK_THEME, action) => {
    switch (action.type){
        case SWITCH_THEME:
            return (state.theme === 'light')? DARK_THEME : LIGHT_THEME;
        default:
            return state
    }
};

export default themeReducer;
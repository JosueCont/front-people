const LOGGED_IN_USER="LOGGED_IN_USER",
CHANGE_LANG= "CHANGE_LANG",
COMPANY_SELECTED = "COMPANY_SELECTED"


export function user(state, action) {
    switch (action.type) {
        case LOGGED_IN_USER:
            return { ...state, user: action.payload };
        case CHANGE_LANG:
            return { ...state, lang: action.payload };
        default:
            return state;
    }
}
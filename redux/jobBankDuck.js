import WebApiJobBank from "../api/WebApiJobBank";

const initialState = {
    list_clients: {},
    load_clients: false,
    page_clients: 1,
}

const SET_CLIENTS = "SET_CLIENTS";
const SET_PAGE = "SET_PAGE";

const jobBankReducer = (state = initialState, action) =>{
    switch (action.type){
        case SET_CLIENTS:
            return {...state,
                list_clients: action.payload,
                load_clients: action.fetching,
                page_clients: action.page_num
            }
        case SET_PAGE:
            return {...state, page_clients: action.payload}
        default:
            return state;
    }
}

export const setPageClient = (num = 1) => (dispatch) =>{
    dispatch({
        type: SET_PAGE,
        payload: num
    })
}

const setClients = (fetching = false, data = {}, page_num = 1) => (dispatch, getState) => {
    dispatch({
        type: SET_CLIENTS,
        payload: data,
        fetching,
        page_num
    })
}

export const getClients = (node) => async (dispatch, getState) => {
    dispatch(setClients(true))
    try {
        let response = await WebApiJobBank.getClients(node);
        dispatch(setClients(false, response.data))
    } catch (e) {
        dispatch(setClients(false))
    }
}

export default jobBankReducer;
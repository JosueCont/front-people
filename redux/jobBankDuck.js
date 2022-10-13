import WebApiJobBank from "../api/WebApiJobBank";

const initialState = {
    list_clients: {},
    list_vacancies: {},
    list_sectors: {},
    list_competences: {},
    list_academics: {},
    list_main_categories: {},
    list_sub_categories: {},
    info_vacant: {},
    load_jobbank: false,
    page_jobbank: 1
}

const SET_CLIENTS = "SET_CLIENTS";
const SET_VACANCIES = "SET_VACANCIES";
const SET_VACANT = "SET_VACANT";
const SET_SECTORS = "SET_SECTORS";
const SET_COMPETENCES = "SET_COMPETENCES";
const SET_ACADEMICS = "SET_ACADEMICS";
const SET_MAIN_CATEGORIES = "SET_MAIN_CATEGORIES";
const SET_SUB_CATEGORIES = "SET_SUB_CATEGORIES";
const SET_PAGE = "SET_PAGE";
const SET_LOAD = "SET_LOAD";

const jobBankReducer = (state = initialState, action) =>{
    switch (action.type){
        case SET_CLIENTS:
            return {...state,
                list_clients: action.payload,
                load_jobbank: action.fetching,
                page_jobbank: action.page_num
            }
        case SET_VACANCIES:
            return {...state,
                list_vacancies: action.payload,
                load_jobbank: action.fetching,
                page_jobbank: action.page_num
            }
        case SET_SECTORS:
            return {...state,
                list_sectors: action.payload
            }
        case SET_COMPETENCES:
            return {...state,
                list_competences: action.payload
            }
        case SET_ACADEMICS:
            return {...state,
                list_academics: action.payload
            }
        case SET_MAIN_CATEGORIES:
            return {...state,
                list_main_categories: action.payload
            }
        case SET_SUB_CATEGORIES:
            return {...state,
                list_sub_categories: action.payload
            }
        case SET_VACANT:
            return {...state,
                info_vacant: action.payload,
                load_jobbank: action.fetching
            }
        case SET_PAGE:
            return {...state,
                page_jobbank: action.payload
            }
        case SET_LOAD:
            return{...state,
                load_jobbank: action.payload
            }
        default:
            return state;
    }
}

export const setLoadJobBank = (
    fetching = false
) => (dispatch) =>{
    dispatch({
        type: SET_LOAD,
        payload: fetching
    })
}

export const setPage = (
    num = 1
) => (dispatch) =>{
    dispatch({
        type: SET_PAGE,
        payload: num
    })
}

const setClients = (
    fetching = false,
    data = {},
    page_num = 1
) => (dispatch, getState) => {
    dispatch({
        type: SET_CLIENTS,
        payload: data,
        fetching,
        page_num
    })
}

const setVacancies = (
    fetching = false,
    data = {},
    page_num = 1
) => (dispatch, getState) =>{
    dispatch({
        type: SET_VACANCIES,
        payload: data,
        fetching,
        page_num
    })
}

const setVacant = (
    fetching = false,
    data = {}
) => (dispatch, getState) =>{
    dispatch({
        type: SET_VACANT,
        payload: data,
        fetching
    })
}

export const getClients = (node, query = '', page) => async (dispatch, getState) => {
    dispatch(setClients(true))
    try {
        let response = await WebApiJobBank.getClients(node, query);
        dispatch(setClients(false, response.data, page))
    } catch (e) {
        console.log(e)
        dispatch(setClients(false))
    }
}

export const getSectors = (node) => async (dispatch, getState) =>{
    try {
        let response = await WebApiJobBank.getSectors(node);
        dispatch({
            type: SET_SECTORS,
            payload: response.data
        })
    } catch (e) {
        console.log(e)
    }
}

export const getCompetences = (node) => async (dispatch, getState) =>{
    try {
        let response = await WebApiJobBank.getCompetences(node);
        dispatch({
            type: SET_COMPETENCES,
            payload: response.data
        })
    } catch (e) {
        console.log(e)
    }
}

export const getAcademics = (node) => async (dispatch, getState) =>{
    try {
        let response = await WebApiJobBank.getAcademics(node);
        dispatch({
            type: SET_ACADEMICS,
            payload: response.data
        })
    } catch (e) {
        console.log(e)
    }
}

export const getMainCategories = (node) => async (dispatch, getState) =>{
    try {
        let response = await WebApiJobBank.getMainCategories(node);
        dispatch({
            type: SET_MAIN_CATEGORIES,
            payload: response.data
        })
    } catch (e) {
        console.log(e)
    }
}

export const getSubCategories = (node) => async (dispatch, getState) =>{
    try {
        let response = await WebApiJobBank.getSubCategories(node);
        dispatch({
            type: SET_SUB_CATEGORIES,
            payload: response.data
        })
    } catch (e) {
        console.log(e)
    }
}

export const getVacancies = (node, query = '', page) => async (dispatch, getState) =>{
    dispatch(setVacancies(true))
    try {
        let response = await WebApiJobBank.getVacancies(node, query);
        dispatch(setVacancies(false, response.data, page))
    } catch (e) {
        console.log(e)
        dispatch(setVacancies(false))
    }
}

export const getInfoVacant = (id) => async (dispatch, getState) =>{
    dispatch(setVacant(true))
    try {
        let response = await WebApiJobBank.getInfoVacant(id);
        dispatch(setVacant(false, response.data));
    } catch (e) {
        console.log(e)
        dispatch(setVacant(false))
    }
}

export default jobBankReducer;
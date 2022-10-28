import WebApiJobBank from "../api/WebApiJobBank";
import { userCompanyId } from "../libs/auth";

const initialState = {
    list_clients: {},
    list_vacancies: {},
    list_strategies: {},
    list_profiles: {},
    list_sectors: [],
    list_competences: [],
    list_academics: [],
    list_main_categories: [],
    list_sub_categories: [],
    list_profiles_types: [],
    info_vacant: {},
    info_strategy: {},
    info_profile: {},
    list_clients_options: [],
    list_vacancies_options: [],
    list_vacancies_fields: {},
    load_clients: false,
    load_vacancies: false,
    load_strategies: false,
    load_jobbank: false,
    load_profiles: false,
    load_profiles_types: false,
    load_clients_options: false,
    page_jobbank: 1
}

const SET_CLIENTS = "SET_CLIENTS";
const SET_CLIENTS_OPTIONS = "SET_CLIENTS_OPTIONS";

const SET_VACANCIES = "SET_VACANCIES";
const SET_VACANCIES_FIELDS = "SET_VACANCIES_FIELDS";
const SET_VACANT_INFO = "SET_VACANT_INFO";
const SET_VACANCIES_OPTIONS = "SET_VACANCIES_OPTIONS";
const SET_VACANCIES_LOAD = "SET_VACANCIES_LOAD";

const SET_STRATEGIES = "SET_STRATEGIES";
const SET_STRATEGIES_LOAD = "SET_STRATEGIES_LOAD";
const SET_STRATEGY_INFO = "SET_STRATEGY_INFO";

const SET_PROFILES = "SET_PROFILES";
const SET_PROFILES_TYPES = "SET_PROFILES_TYPES";
const SET_PROFILE_INFO = "SET_PROFILE_INFO";
const SET_PROFILES_LOAD = "SET_PROFILES_LOAD";

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
                load_clients: action.fetching,
                page_jobbank: action.page_num
            }
        case SET_VACANCIES:
            return {...state,
                list_vacancies: action.payload,
                load_vacancies: action.fetching,
                page_jobbank: action.page_num
            }
        case SET_STRATEGIES:
            return {...state,
                list_strategies: action.payload,
                load_strategies: action.fetching,
                page_jobbank: action.page_num
            }
        case SET_VACANT_INFO:
            return {...state,
                info_vacant: action.payload,
                load_vacancies: action.fetching
            }
        case SET_STRATEGY_INFO:
            return {...state,
                info_strategy: action.payload,
                load_strategies: action.fetching
            }
        case SET_VACANCIES_OPTIONS:
            return {...state,
                list_vacancies_options: action.payload,
                load_vacancies: action.fetching
            }
        case SET_CLIENTS_OPTIONS:
            return {...state,
                list_clients_options: action.payload,
                load_clients_options: action.fetching
            }
        case SET_PROFILES:
            return {...state,
                list_profiles: action.payload,
                load_profiles: action.fetching
            }
        case SET_PROFILES_TYPES:
            return {...state,
                list_profiles_types: action.payload,
                load_profiles_types: action.fetching
            }
        case SET_VACANCIES_FIELDS:
            return {...state,
                list_vacancies_fields: action.payload,
                load_vacancies: action.fetching
            }
        case SET_PROFILE_INFO:
            return {...state,
                info_profile: action.payload,
                load_profiles: action.fetching
            }
        case SET_SECTORS:
            return {...state, list_sectors: action.payload }
        case SET_COMPETENCES:
            return {...state, list_competences: action.payload }
        case SET_ACADEMICS:
            return {...state, list_academics: action.payload }
        case SET_MAIN_CATEGORIES:
            return {...state, list_main_categories: action.payload }
        case SET_SUB_CATEGORIES:
            return {...state, list_sub_categories: action.payload }
        case SET_PAGE:
            return {...state, page_jobbank: action.payload }
        case SET_LOAD:
            return{...state, load_jobbank: action.payload }
        case SET_STRATEGIES_LOAD:
            return {...state, load_strategies: action.payload }
        case SET_VACANCIES_LOAD:
            return {...state, load_vacancies: action.payload }
        case SET_PROFILES_LOAD:
            return {...state, load_profiles: action.payload }
        default:
            return state;
    }
}

export const setLoadJobBank = (fetching = false) => (dispatch) =>{
    dispatch({type: SET_LOAD, payload: fetching})
}

export const setLoadVacancies = (fetching = false) => (dispatch) =>{
    dispatch({type: SET_VACANCIES_LOAD, payload: fetching })
}

export const setLoadStrategies = (fetching = false) => (dispatch) =>{
    dispatch({type: SET_STRATEGIES_LOAD, payload: fetching })
}

export const setLoadProfiles = (fetching = false) => (dispatch) =>{
    dispatch({type: SET_PROFILES_LOAD, payload: fetching})
}

export const setPage = (num = 1) => (dispatch) =>{
    dispatch({type: SET_PAGE, payload: num})
}

export const getGeneralJobBank = (node, config) => async (dispatch) =>{
    try {
        const isActive = (item) => item.app == 'JOBBANK' && item.is_active;
        let _isActive = config.applications?.some(isActive);
        if(!_isActive) return false;
        //Por ahora la lista de clientes es el que más
        //se utliza en toda la app de Bolsa de trabajo
        dispatch(getClientsOptions(node));
    } catch (e) {
        console.log(e)
    }
}

export const getClients = (node, query = '', page = 1) => async (dispatch) => {
    const typeFunction = { type: SET_CLIENTS, payload: {}, fetching: false, page_num: page };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getClients(node, query);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getClientsOptions = (node) => async (dispatch) =>{
    const typeFunction = { type: SET_CLIENTS_OPTIONS, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getClients(node,'&paginate=0');
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getVacancies = (node, query = '', page = 1) => async (dispatch) =>{
    const typeFunction = { type: SET_VACANCIES, payload: {}, fetching: false, page_num: page };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getVacancies(node, query);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getVacanciesOptions = (node) => async (dispatch) =>{
    const typeFunction = { type: SET_VACANCIES_OPTIONS, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getVacancies(node, '&paginate=0');
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getVacantFields = (node) => async (dispatch) =>{
    const typeFunction = { type: SET_VACANCIES_FIELDS, payload: {}, fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getVacantFields(node);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getInfoVacant = (id) => async (dispatch) =>{
    const typeFunction = { type: SET_VACANT_INFO, payload: {}, fetching: false};
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getInfoVacant(id);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getStrategies = (node, query = '', page = 1) => async (dispatch) =>{
    const typeFunction = { type: SET_STRATEGIES, payload: {}, fetching: false, page_num: page };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getStrategies(node, query);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getInfoStrategy = (id) => async (dispatch) =>{
    const typeFunction = { type: SET_STRATEGY_INFO, payload: {}, fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getInfoStrategy(id);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e);
        dispatch(typeFunction)
    }
}

export const getProfilesList = (node, query = '', page = 1) => async (dispatch) =>{
    const typeFunction = { type: SET_PROFILES, payload: {}, fetching: false, page_num: page };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getProfilesList(node, query);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getProfilesTypes = (node) => async (dispatch) =>{
    const typeFunction = { type: SET_PROFILES_TYPES, payload: [], fetching: false};
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getProfilesTypes(node);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getInfoProfile = (id) => async (dispatch) =>{
    const typeFunction = { type: SET_PROFILE_INFO, payload: {}, fetching: false};
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getInfoProfile(id);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getSectors = (node) => async (dispatch) =>{
    try {
        let response = await WebApiJobBank.getSectors(node);
        dispatch({type: SET_SECTORS, payload: response.data})
    } catch (e) {
        console.log(e)
    }
}

export const getCompetences = (node) => async (dispatch) =>{
    try {
        let response = await WebApiJobBank.getCompetences(node);
        dispatch({type: SET_COMPETENCES, payload: response.data})
    } catch (e) {
        console.log(e)
    }
}

export const getAcademics = (node) => async (dispatch) =>{
    try {
        let response = await WebApiJobBank.getAcademics(node);
        dispatch({type: SET_ACADEMICS, payload: response.data})
    } catch (e) {
        console.log(e)
    }
}

export const getMainCategories = (node) => async (dispatch) =>{
    try {
        let response = await WebApiJobBank.getMainCategories(node);
        dispatch({type: SET_MAIN_CATEGORIES, payload: response.data})
    } catch (e) {
        console.log(e)
    }
}

export const getSubCategories = (node) => async (dispatch) =>{
    try {
        let response = await WebApiJobBank.getSubCategories(node);
        dispatch({type: SET_SUB_CATEGORIES, payload: response.data})
    } catch (e) {
        console.log(e)
    }
}

export default jobBankReducer;
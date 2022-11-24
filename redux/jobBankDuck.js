import WebApiJobBank from "../api/WebApiJobBank";

const initialState = {
    list_clients: {},
    list_vacancies: {},
    list_strategies: {},
    list_profiles: {},
    list_candidates: {},
    list_sectors: [],
    list_competences: [],
    list_academics: [],
    list_main_categories: [],
    list_sub_categories: [],
    list_profiles_types: [],
    list_profiles_options: [],
    list_clients_options: [],
    list_vacancies_options: [],
    list_vacancies_fields: {},
    list_connections: [],
    list_jobboards_options: [],
    list_publications: {},
    list_specialization_area: [],
    info_strategy: {},
    info_profile: {},
    info_publication: {},
    load_clients: false,
    load_vacancies: false,
    load_strategies: false,
    load_profiles: false,
    load_sectors: false,
    load_competences: false,
    load_academics: false,
    load_profiles_types: false,
    load_clients_options: false,
    load_vacancies_options: false,
    load_vacancies_fields: false,
    load_main_categories: false,
    load_sub_categories: false,
    load_candidates: false,
    load_connections: false,
    load_jobboards_options: false,
    load_publications: false,
    load_profiles_options: false,
    load_specialization_area: false,
    jobbank_load: false,
    jobbank_page: 1,
    jobbank_filters: "",
}

const GET_CLIENTS = "GET_CLIENTS";
const GET_CLIENTS_OPTIONS = "GET_CLIENTS_OPTIONS";

const GET_VACANCIES = "GET_VACANCIES";
const GET_VACANCIES_FIELDS = "GET_VACANCIES_FIELDS";
const GET_VACANCIES_OPTIONS = "GET_VACANCIES_OPTIONS";

const GET_STRATEGIES = "GET_STRATEGIES";
const GET_STRATEGY_INFO = "GET_STRATEGY_INFO";
const SET_STRATEGY_INFO = "SET_STRATEGY_INFO";
const SET_STRATEGIES_LOAD = "SET_STRATEGIES_LOAD";

const GET_PROFILES = "GET_PROFILES";
const GET_PROFILES_TYPES = "GET_PROFILES_TYPES";
const GET_PROFILE_INFO = "GET_PROFILE_INFO";
const SET_PROFILE_INFO = "SET_PROFILE_INFO";
const SET_PROFILES_LOAD = "SET_PROFILES_LOAD";
const GET_PROFILES_OPTIONS = "GET_PROFILES_OPTIONS";

const GET_CANDIDATES = "GET_CANDIDATES";

const GET_PUBLICATIONS = "GET_PUBLICATIONS";
const GET_PUBLICATION_INFO = "GET_PUBLICATION_INFO";
const SET_PUBLICATION_INFO = "SET_PUBLICATION_INFO";
const SET_PUBLICATIONS_LOAD = "SET_PUBLICATIONS_LOAD";

const GET_CONNECTIONS = "GET_CONNECTIONS";

const GET_SECTORS = "GET_SECTORS";
const GET_COMPETENCES = "GET_COMPETENCES";
const GET_ACADEMICS = "GET_ACADEMICS";
const GET_MAIN_CATEGORIES = "GET_MAIN_CATEGORIES";
const GET_SUB_CATEGORIES = "GET_SUB_CATEGORIES";
const GET_JOB_VACANCIES = "GET_JOB_VACANCIES";
const GET_SPECIALIZATION_AREA = "GET_SPECIALIZATION_AREA";

const SET_PAGE = "SET_PAGE";
const SET_LOAD = "SET_LOAD";
const SET_FILTERS = "SET_FILTERS";

const jobBankReducer = (state = initialState, action) =>{
    switch (action.type){
        case GET_CLIENTS:
            return {...state,
                list_clients: action.payload,
                load_clients: action.fetching,
                jobbank_page: action.page_num
            }
        case GET_VACANCIES:
            return {...state,
                list_vacancies: action.payload,
                load_vacancies: action.fetching,
                jobbank_page: action.page_num
            }
        case GET_STRATEGIES:
            return {...state,
                list_strategies: action.payload,
                load_strategies: action.fetching,
                jobbank_page: action.page_num
            }
        case GET_PROFILES:
            return {...state,
                list_profiles: action.payload,
                load_profiles: action.fetching,
                jobbank_page: action.page_num
            }
        case GET_CANDIDATES:
            return {...state,
                list_candidates: action.payload,
                load_candidates: action.fetching,
                jobbank_page: action.page_num
            }
        case GET_STRATEGY_INFO:
            return {...state,
                info_strategy: action.payload,
                load_strategies: action.fetching
            }
        case GET_PROFILE_INFO:
            return {...state,
                info_profile: action.payload,
                load_profiles: action.fetching
            }
        case GET_VACANCIES_OPTIONS:
            return {...state,
                list_vacancies_options: action.payload,
                load_vacancies_options: action.fetching
            }
        case GET_CLIENTS_OPTIONS:
            return {...state,
                list_clients_options: action.payload,
                load_clients_options: action.fetching
            }
        case GET_PROFILES_TYPES:
            return {...state,
                list_profiles_types: action.payload,
                load_profiles_types: action.fetching
            }
        case GET_VACANCIES_FIELDS:
            return {...state,
                list_vacancies_fields: action.payload,
                load_vacancies_fields: action.fetching
            }
        case GET_SECTORS:
            return {...state,
                list_sectors: action.payload,
                load_sectors: action.fetching
            }
        case GET_COMPETENCES:
            return {...state,
                list_competences: action.payload,
                load_competences: action.fetching
            }
        case GET_ACADEMICS:
            return {...state,
                list_academics: action.payload,
                load_academics: action.fetching
            }
        case GET_MAIN_CATEGORIES:
            return {...state,
                list_main_categories: action.payload,
                load_main_categories: action.fetching
            }
        case GET_SUB_CATEGORIES:
            return {...state,
                list_sub_categories: action.payload,
                load_sub_categories: action.fetching
            }
        case GET_CONNECTIONS:
            return{...state,
                list_connections: action.payload,
                load_connections: action.fetching
            }
        case GET_JOB_VACANCIES:
            return{...state,
                list_jobboards_options: action.payload,
                load_jobboards_options: action.fetching
            }
        case GET_PUBLICATIONS:
            return{...state,
                list_publications: action.payload,
                load_publications: action.fetching,
                jobbank_page: action.page_num
            }
        case GET_PUBLICATION_INFO:
            return {...state,
                info_publication: action.payload,
                load_publications: action.fetching
            }
        case GET_PROFILES_OPTIONS:
            return{...state,
                list_profiles_options: action.payload,
                load_profiles_options: action.fetching
            }
        case GET_SPECIALIZATION_AREA:
            return{...state,
                list_specialization_area: action.payload,
                load_specialization_area: action.fetching
            }
        case SET_STRATEGIES_LOAD:
            return {...state, load_strategies: action.payload }
        case SET_PROFILES_LOAD:
            return {...state, load_profiles: action.payload }
        case SET_PUBLICATIONS_LOAD:
            return {...state, load_publications: action.payload }
        case SET_PROFILE_INFO:
            return {...state, info_profile: action.payload }
        case SET_STRATEGY_INFO:
            return {...state, info_strategy: action.payload }
        case SET_PUBLICATION_INFO:
            return {...state, info_publication: action.payload }
        case SET_PAGE:
            return {...state, jobbank_page: action.payload }
        case SET_LOAD:
            return{...state, jobbank_load: action.payload }
        case SET_FILTERS:
            return {...state, jobbank_filters: action.payload}
        default:
            return state;
    }
}

export const setJobbankPage = (num = 1) => (dispatch) =>{
    dispatch({type: SET_PAGE, payload: num})
}

export const setJobbankLoad = (fetching = false) => (dispatch) =>{
    dispatch({type: SET_LOAD, payload: fetching})
}

export const setJobbankFilters = (data) => (dispatch) =>{
    dispatch({type: SET_FILTERS, payload: data})
}

export const setLoadStrategies = (fetching = false) => (dispatch) =>{
    dispatch({type: SET_STRATEGIES_LOAD, payload: fetching })
}

export const setLoadProfiles = (fetching = false) => (dispatch) =>{
    dispatch({type: SET_PROFILES_LOAD, payload: fetching})
}

export const setLoadPublications = (fetching = false) => (dispatch) =>{
    dispatch({type: SET_PUBLICATIONS_LOAD, payload: fetching})
}

export const setInfoStrategy = (data = {}) => (dispatch) =>{
    dispatch({type: SET_STRATEGY_INFO, payload: data})
}

export const setInfoProfile = (data = {}) => (dispatch) =>{
    dispatch({type: SET_PROFILE_INFO, payload: data})
}

export const setInfoPublication = (data = {}) => (dispatch)=>{
    dispatch({type: SET_PUBLICATION_INFO, payload: data})
}

export const getClients = (node, query = '', page = 1) => async (dispatch) => {
    const typeFunction = { type: GET_CLIENTS, payload: {}, fetching: false, page_num: page };
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
    const typeFunction = { type: GET_CLIENTS_OPTIONS, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getClients(node,'&paginate=0');
        //Se filtra por estatus activo/true
        const _filter = item => item.is_active;
        let results = response.data?.filter(_filter);
        dispatch({...typeFunction, payload: results})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getVacancies = (node, query = '', page = 1) => async (dispatch) =>{
    const typeFunction = { type: GET_VACANCIES, payload: {}, fetching: false, page_num: page };
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
    const typeFunction = { type: GET_VACANCIES_OPTIONS, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getVacancies(node, '&paginate=0');
        //Se filtra por estatus activo/1
        const _filter = item => item.status == 1;
        let results = response.data?.filter(_filter);
        dispatch({...typeFunction, payload: results})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getVacantFields = (node) => async (dispatch) =>{
    const typeFunction = { type: GET_VACANCIES_FIELDS, payload: {}, fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getVacantFields(node);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getStrategies = (node, query = '', page = 1) => async (dispatch) =>{
    const typeFunction = { type: GET_STRATEGIES, payload: {}, fetching: false, page_num: page };
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
    const typeFunction = { type: GET_STRATEGY_INFO, payload: {}, fetching: false };
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
    const typeFunction = { type: GET_PROFILES, payload: {}, fetching: false, page_num: page };
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
    const typeFunction = { type: GET_PROFILES_TYPES, payload: [], fetching: false};
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
    const typeFunction = { type: GET_PROFILE_INFO, payload: {}, fetching: false};
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getInfoProfile(id);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getProfilesOptions = (node) => async (dispatch) =>{
    const typeFunction = { type: GET_PROFILES_OPTIONS, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getProfilesList(node, '&paginate=0');
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getCandidates = (node, query = '', page = 1) => async (dispatch) =>{
    const typeFunction = { type: GET_CANDIDATES, payload: {}, fetching: false, page_num: page }
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getCandidates(node, query);
        console.log("🚀 ~ file: jobBankDuck.js ~ line 489 ~ getCandidates ~ response", response)
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getPublications = (node, query = '', page = 1) => async (dispatch) =>{
    const typeFunction = { type: GET_PUBLICATIONS, payload: {}, fetching: false, page_num: page };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getPublications(node, query);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getInfoPublication = (id) => async (dispatch) =>{
    const typeFunction = { type: GET_PUBLICATION_INFO, payload: {}, fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getInfoPublication(id);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getSectors = (node) => async (dispatch) =>{
    const typeFunction = { type: GET_SECTORS, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getSectors(node);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        dispatch(typeFunction)
        console.log(e)
    }
}

export const getCompetences = (node) => async (dispatch) =>{
    const typeFunction = { type: GET_COMPETENCES, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getCompetences(node);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        dispatch(typeFunction)
        console.log(e)
    }
}

export const getAcademics = (node) => async (dispatch) =>{
    const typeFunction = { type: GET_ACADEMICS, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getAcademics(node);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        dispatch(typeFunction)
        console.log(e)
    }
}

export const getMainCategories = (node) => async (dispatch) =>{
    const typeFunction = { type: GET_MAIN_CATEGORIES, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getMainCategories(node);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getSubCategories = (node) => async (dispatch) =>{
    const typeFunction = { type: GET_SUB_CATEGORIES, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getSubCategories(node);
        dispatch({...typeFunction, payload: response.data})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getConnections = (node, isOptions = false) => async (dispatch) =>{
    const typeFunction = { type: GET_CONNECTIONS, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getConnections(node);
        //Se filtra por estatus activo/true
        const _filter = item => item.is_active;
        let results = response.data?.results.filter(_filter);
        //IsOptions para pintar el listado en un select,
        //por el momento solo se usa en publicaciones
        let payload = isOptions ? results : response.data.results;
        dispatch({...typeFunction, payload});
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getJobBoards = (node) => async(dispatch) => {
    const typeFunction = { type: GET_JOB_VACANCIES, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true})
    try {
        let response = await WebApiJobBank.getJobBoards(node);
        dispatch({...typeFunction, payload: response.data.results});
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getSpecializationArea = (node) => async (dispatch) =>{
    const typeFunction = { type: GET_SPECIALIZATION_AREA, payload: [], fetching: false };
    dispatch({...typeFunction, fetching: true});
    try {
        let response = await WebApiJobBank.getSpecializationArea(node);
        dispatch({...typeFunction, payload: response.data.results})
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export default jobBankReducer;
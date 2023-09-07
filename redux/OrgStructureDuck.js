import WebApiOrgStructure from '../api/WebApiOrgStructure';

const initialState = {
    list_org_levels: {},
    load_org_levels: false,
    list_org_levels_options: [],
    list_org_levels_tree: [],
    load_org_levels_options: false,
    list_org_nodes: {},
    load_org_nodes: false,
    list_org_nodes_options: [],
    list_org_nodes_tree: [],
    load_org_nodes_options: false,
    list_ranks: {},
    load_ranks: false,
    list_ranks_options: [],
    load_ranks_options: false,
    list_jobs: {},
    load_jobs: false,
    list_jobs_options: [],
    load_jobs_options: false,
    list_places: {},
    load_places: false,
    list_places_options: [],
    load_places_options: false,
    list_types_persons: {},
    load_types_persons: false,
    list_types_persons_options: [],
    load_types_persons_options: false,
    list_places_history: {},
    load_places_history: false,
    org_page: 1,
    org_filters: "",
    org_page_size: 10,
    org_filters_data: {}
}

const GET_ORG_LEVELS = "GET_ORG_LEVELS";
const GET_ORG_LEVELS_OPTIONS = "GET_ORG_LEVELS_OPTIONS";
const GET_ORG_NODES = "GET_ORG_NODES";
const GET_ORG_NODES_OPTIONS = "GET_ORG_NODES_OPTIONS";
const GET_RANKS = "GET_RANKS";
const GET_RANKS_OPTIONS = "GET_RANKS_OPTIONS";
const GET_JOBS = "GET_JOBS";
const GET_JOBS_OPTIONS = "GET_JOBS_OPTIONS";
const GET_PLACES = "GET_PLACES";
const GET_PLACES_OPTIONS = "GET_PLACES_OPTIONS";
const GET_PLACES_HISTORY = "GET_PLACES_HISTORY";
const GET_TYPES_PERSONS = "GET_TYPES_PERSONS";
const GET_TYPES_PERSONS_OPTIONS = "GET_TYPES_PERSONS_OPTIONS";
const SET_FILTERS_DATA = "SET_FILTERS_DATA";

const orgReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ORG_LEVELS:
            return {
                ...state,
                list_org_levels: action.payload,
                load_org_levels: action.fetching,
                org_page: action.page,
                org_filters: action.query,
                org_page_size: action.size
            }
        case GET_ORG_LEVELS_OPTIONS:
            return {
                ...state,
                list_org_levels_options: action.options,
                list_org_levels_tree: action.tree,
                load_org_levels_options: action.fetching
            }
        case GET_ORG_NODES:
            return {
                ...state,
                list_org_nodes: action.payload,
                load_org_nodes: action.fetching,
                org_page: action.page,
                org_filters: action.query,
                org_page_size: action.size
            }
        case GET_ORG_NODES_OPTIONS:
            return {
                ...state,
                list_org_nodes_options: action.options,
                list_org_nodes_tree: action.tree,
                load_org_nodes_options: action.fetching
            }
        case GET_RANKS:
            return {
                ...state,
                list_ranks: action.payload,
                load_ranks: action.fetching,
                org_page: action.page,
                org_filters: action.query,
                org_page_size: action.size
            }
        case GET_RANKS_OPTIONS:
            return {
                ...state,
                list_ranks_options: action.payload,
                load_ranks_options: action.fetching
            }
        case GET_JOBS:
            return {
                ...state,
                list_jobs: action.payload,
                load_jobs: action.fetching,
                org_page: action.page,
                org_filters: action.query,
                org_page_size: action.size
            }
        case GET_JOBS_OPTIONS:
            return {
                ...state,
                list_jobs_options: action.payload,
                load_jobs_options: action.fetching,
            }
        case GET_PLACES:
            return {
                ...state,
                list_places: action.payload,
                load_places: action.fetching,
                org_page: action.page,
                org_filters: action.query,
                org_page_size: action.size
            }
        case GET_PLACES_OPTIONS:
            return {
                ...state,
                list_places_options: action.payload,
                load_places_options: action.fetching
            }
        case SET_FILTERS_DATA:
            return {
                ...state,
                org_filters_data: action.keep ? {
                    ...state.org_filters_data,
                    ...action.payload
                } : action.payload
            }
        case GET_TYPES_PERSONS:
            return {
                ...state,
                list_types_persons: action.payload,
                load_types_persons: action.fetching,
                org_page: action.page,
                org_filters: action.query,
                org_page_size: action.size
            }
        case GET_TYPES_PERSONS_OPTIONS:
            return {
                ...state,
                list_types_persons_options: action.payload,
                load_types_persons_options: action.fetching
            }
        case GET_PLACES_HISTORY:
            return {
                ...state,
                list_places_history: action.payload,
                load_places_history: action.fetching,
                org_page: action.page,
                org_filters: action.query,
                org_page_size: action.size
            }
        default:
            return state
    }
}

export const setOrgFiltersData = (data = {}, keep = true) => (dispatch) => {
    dispatch({ type: SET_FILTERS_DATA, payload: data, keep })
}

export const getOrgLevels = (query = '', page = 1, size = 10) => async (dispatch, getState) => {
    // const { orgStore: { list_org_levels } } = getState();
    const action = { type: GET_ORG_LEVELS, payload: {}, fetching: false, query, page, size };
    dispatch({ ...action, fetching: true })
    try {
        let params = `?is_deleted=false${query}`;
        let response = await WebApiOrgStructure.getOrgLevels(params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getOrgLevelsOptions = (query = '') => async (dispatch, getState) => {
    const { orgStore: { list_org_levels_tree, list_org_levels_options } } = getState();
    const action = {
        type: GET_ORG_LEVELS_OPTIONS,
        options: list_org_levels_options,
        tree: list_org_levels_tree,
        fetching: false
    };
    dispatch({ ...action, fetching: true })
    try {
        let params = `?paginate=0&is_deleted=false&showTree=true${query}`;
        let response = await WebApiOrgStructure.getOrgLevels(params);
        const { results, tree_view_data } = response?.data;
        dispatch({ ...action, options: results, tree: tree_view_data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getOrgNodes = (query = '', page = 1, size = 10) => async (dispatch, getState) => {
    // const { orgStore: { list_org_nodes } } = getState();
    const action = { type: GET_ORG_NODES, payload: {}, fetching: false, query, page, size };
    dispatch({ ...action, fetching: true })
    try {
        let params = `?is_deleted=false${query}`;
        let response = await WebApiOrgStructure.getOrgNodes(params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getOrgNodesOptions = (query = '') => async (dispatch, getState) => {
    const { orgStore: { list_org_nodes_tree, list_org_nodes_options } } = getState();
    const action = {
        type: GET_ORG_NODES_OPTIONS,
        options: list_org_nodes_options,
        tree: list_org_nodes_tree,
        fetching: false
    };
    dispatch({ ...action, fetching: true })
    try {
        let params = `?paginate=0&is_deleted=false&showTree=true${query}`;
        let response = await WebApiOrgStructure.getOrgNodes(params);
        const { results, tree_view_data } = response?.data;
        dispatch({ ...action, options: results, tree: tree_view_data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getRanks = (query = '', page = 1, size = 10) => async (dispatch, getState) => {
    // const { orgStore: { list_ranks } } = getState();
    const action = { type: GET_RANKS, payload: {}, fetching: false, query, page, size };
    dispatch({ ...action, fetching: true })
    try {
        let params = `?is_deleted=false${query}`;
        let response = await WebApiOrgStructure.getRanks(params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getRanksOptions = (query = '') => async (dispatch) => {
    const action = { type: GET_RANKS_OPTIONS, payload: [], fetching: false };
    dispatch({ ...action, fetching: true })
    try {
        let params = `?paginate=0&is_deleted=false${query}`;
        let response = await WebApiOrgStructure.getRanks(params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getJobs = (query = '', page = 1, size = 10) => async (dispatch, getState) => {
    // const { orgStore: { list_jobs } } = getState();
    const action = { type: GET_JOBS, payload: {}, fetching: false, query, page, size };
    dispatch({ ...action, fetching: true })
    try {
        let params = `?is_deleted=false${query}`;
        let response = await WebApiOrgStructure.getJobs(params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getJobsOptions = (query = '') => async (dispatch) => {
    const action = { type: GET_JOBS_OPTIONS, payload: [], fetching: false };
    dispatch({ ...action, fetching: true })
    try {
        let params = `?paginate=0&is_deleted=false${query}`;
        let response = await WebApiOrgStructure.getJobs(params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getPlaces = (query = '', page = 1, size = 10) => async (dispatch, getState) => {
    // const { orgStore: { list_places } } = getState();
    const action = { type: GET_PLACES, payload: {}, fetching: false, query, page, size };
    dispatch({ ...action, fetching: true })
    try {
        let params = `?is_deleted=false${query}`;
        let response = await WebApiOrgStructure.getPlaces(params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getPlacesOptions = (query = '') => async (dispatch) => {
    const action = { type: GET_PLACES_OPTIONS, payload: [], fetching: false };
    dispatch({ ...action, fetching: true })
    try {
        let params = `?paginate=0&is_deleted=false${query}`;
        let response = await WebApiOrgStructure.getPlaces(params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getPlacesHistory = (query = '', page = 1, size = 10) => async (dispatch) => {
    const action = { type: GET_PLACES_HISTORY, payload: {}, fetching: false, query, page, size };
    dispatch({ ...action, fetching: true })
    try {
        let response = await WebApiOrgStructure.getPlacesHistory(query);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getTypesPersons = (node, query = '', page = 1, size = 10) => async (dispatch, getState) => {
    const action = { type: GET_TYPES_PERSONS, payload: {}, fetching: false, query, page, size };
    dispatch({ ...action, fetching: true })
    try {
        let params = `&is_deleted=false${query}`;
        let response = await WebApiOrgStructure.getTypesPersons(node, params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getTypesPersonsOptions = (node, query = '') => async (dispatch) => {
    const action = { type: GET_TYPES_PERSONS_OPTIONS, payload: [], fetching: false };
    dispatch({ ...action, fetching: true })
    try {
        let params = `&paginate=0&is_deleted=false${query}`
        let response = await WebApiOrgStructure.getTypesPersons(node, params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export default orgReducer;
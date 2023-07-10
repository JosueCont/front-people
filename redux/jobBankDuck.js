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
    list_connections: {},
    list_connections_options: [],
    list_jobboards_options: [],
    list_publications: {},
    list_specialization_area: [],
    list_specialization_sub_area: [],
    list_strategies_options: [],
    list_states: [],
    list_selection: {},
    list_candidates_options: [],
    list_preselection: {},
    list_scholarship: [],
    list_tags_notification: [],
    list_interviews: {},
    list_selection_options: [],
    list_applications: {},
    list_applications_candidates: [],
    list_vacancies_search: {},
    list_setup_config: {},
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
    load_specialization_sub_area: false,
    load_strategies_options: false,
    load_connections_options: false,
    load_states: false,
    load_selection: false,
    load_candidates_options: false,
    load_preselection: false,
    load_scholarship: false,
    load_tags_notification: false,
    load_interviews: false,
    load_selection_options: false,
    load_applications: false,
    load_applications_candidates: false,
    load_vacancies_search: false,
    load_setup_config: true,
    jobbank_page: 1,
    jobbank_filters: "",
    jobbank_load: false,
    jobbank_page_size: 10
}

const GET_CLIENTS = "GET_CLIENTS";
const GET_CLIENTS_OPTIONS = "GET_CLIENTS_OPTIONS";

const GET_VACANCIES = "GET_VACANCIES";
const GET_VACANCIES_FIELDS = "GET_VACANCIES_FIELDS";
const GET_VACANCIES_OPTIONS = "GET_VACANCIES_OPTIONS";
const GET_VACANCIES_SEARCH = "GET_VACANCIES_SEARCH";

const GET_PROFILES = "GET_PROFILES";
const GET_PROFILES_TYPES = "GET_PROFILES_TYPES";
const GET_PROFILES_OPTIONS = "GET_PROFILES_OPTIONS";

const GET_CANDIDATES = "GET_CANDIDATES";
const GET_CANDIDATES_OPTIONS = "GET_CANDIDATES_OPTIONS";

const GET_STRATEGIES = "GET_STRATEGIES";
const GET_STRATEGIES_OPTIONS = "GET_STRATEGIES_OPTIONS";

const GET_PUBLICATIONS = "GET_PUBLICATIONS";

const GET_CONNECTIONS = "GET_CONNECTIONS";
const GET_CONNECTIONS_OPTIONS = "GET_CONNECTIONS_OPTIONS";

const GET_SECTORS = "GET_SECTORS";
const GET_COMPETENCES = "GET_COMPETENCES";
const GET_ACADEMICS = "GET_ACADEMICS";
const GET_JOBBOARDS = "GET_JOBBOARDS";
const GET_STATES = "GET_STATES";

const GET_MAIN_CATEGORIES = "GET_MAIN_CATEGORIES";
const GET_SUB_CATEGORIES = "GET_SUB_CATEGORIES";

const GET_SELECTION = "GET_SELECTION";
const GET_SELECTION_OPTIONS = "GET_SELECTION_OPTIONS";
const GET_PRESELECTION = "GET_PRESELECTION";

const GET_SCHOLARSHIP = "GET_SCHOLARSHIP";

const GET_TAGS_NOTIFICATION = "GET_TAGS_NOTIFICATION";

const GET_INTERVIEWS = "GET_INTERVIEWS";

const GET_APPLICATIONS = "GET_APPLICATIONS";
const GET_APPLICATIONS_CANDIDATES = "GET_APPLICATIONS_CANDIDATES";

const GET_SETUP_CONFIG = "GET_SETUP_CONFIG";
const FETCH_SETUP_CONFIG = "FETCH_SETUP_CONFIG";

const SET_PAGE = "SET_PAGE";
const SET_LOAD = "SET_LOAD";
const SET_FILTERS = "SET_FILTERS";

const jobBankReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CLIENTS:
            return {
                ...state,
                list_clients: action.payload,
                load_clients: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query,
                jobbank_page_size: action.size
            }
        case GET_VACANCIES:
            return {
                ...state,
                list_vacancies: action.payload,
                load_vacancies: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query,
                jobbank_page_size: action.size
            }
        case GET_VACANCIES_SEARCH:
            return {
                ...state,
                list_vacancies_search: action.payload,
                load_vacancies_search: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query,
                jobbank_page_size: action.size
            }
        case GET_STRATEGIES:
            return {
                ...state,
                list_strategies: action.payload,
                load_strategies: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query,
                jobbank_page_size: action.size
            }
        case GET_PROFILES:
            return {
                ...state,
                list_profiles: action.payload,
                load_profiles: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query,
                jobbank_page_size: action.size
            }
        case GET_CANDIDATES:
            return {
                ...state,
                list_candidates: action.payload,
                load_candidates: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query,
                jobbank_page_size: action.size
            }
        case GET_VACANCIES_OPTIONS:
            return {
                ...state,
                list_vacancies_options: action.payload,
                load_vacancies_options: action.fetching
            }
        case GET_CLIENTS_OPTIONS:
            return {
                ...state,
                list_clients_options: action.payload,
                load_clients_options: action.fetching
            }
        case GET_PROFILES_TYPES:
            return {
                ...state,
                list_profiles_types: action.payload,
                load_profiles_types: action.fetching
            }
        case GET_VACANCIES_FIELDS:
            return {
                ...state,
                list_vacancies_fields: action.payload,
                load_vacancies_fields: action.fetching
            }
        case GET_SECTORS:
            return {
                ...state,
                list_sectors: action.payload,
                load_sectors: action.fetching
            }
        case GET_COMPETENCES:
            return {
                ...state,
                list_competences: action.payload,
                load_competences: action.fetching
            }
        case GET_ACADEMICS:
            return {
                ...state,
                list_academics: action.payload,
                load_academics: action.fetching
            }
        case GET_MAIN_CATEGORIES:
            return {
                ...state,
                list_main_categories: action.payload,
                load_main_categories: action.fetching
            }
        case GET_SUB_CATEGORIES:
            return {
                ...state,
                list_sub_categories: action.payload,
                load_sub_categories: action.fetching
            }
        case GET_CONNECTIONS:
            return {
                ...state,
                list_connections: action.payload,
                load_connections: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query
            }
        case GET_CONNECTIONS_OPTIONS:
            return {
                ...state,
                list_connections_options: action.payload,
                load_connections_options: action.fetching
            }
        case GET_JOBBOARDS:
            return {
                ...state,
                list_jobboards_options: action.payload,
                load_jobboards_options: action.fetching
            }
        case GET_PUBLICATIONS:
            return {
                ...state,
                list_publications: action.payload,
                load_publications: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query,
                jobbank_page_size: action.size
            }
        case GET_PROFILES_OPTIONS:
            return {
                ...state,
                list_profiles_options: action.payload,
                load_profiles_options: action.fetching
            }
        case GET_STRATEGIES_OPTIONS:
            return {
                ...state,
                list_strategies_options: action.payload,
                load_strategies_options: action.fetching
            }
        case GET_STATES:
            return {
                ...state,
                list_states: action.payload,
                load_states: action.fetching
            }
        case GET_SELECTION:
            return {
                ...state,
                list_selection: action.payload,
                load_selection: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query,
                jobbank_page_size: action.size
            }
        case GET_CANDIDATES_OPTIONS:
            return {
                ...state,
                list_candidates_options: action.payload,
                load_candidates_options: action.fetching
            }
        case GET_PRESELECTION:
            return {
                ...state,
                list_preselection: action.payload,
                load_preselection: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query,
                jobbank_page_size: action.size
            }
        case GET_SCHOLARSHIP:
            return {
                ...state,
                list_scholarship: action.payload,
                load_scholarship: action.fetching
            }
        case GET_TAGS_NOTIFICATION:
            return {
                ...state,
                list_tags_notification: action.payload,
                load_tags_notification: action.fetching
            }
        case GET_INTERVIEWS:
            return {
                ...state,
                list_interviews: action.payload,
                load_interviews: action.fetching,
                jobbank_page: action.page,
                jobbank_filters: action.query
            }
        case GET_SELECTION_OPTIONS:
            return {
                ...state,
                list_selection_options: action.payload,
                load_selection_options: action.fetching
            }
        case GET_APPLICATIONS:
            return {
                ...state,
                list_applications: action.payload,
                load_applications: action.fetching,
                jobbank_filters: action.query,
                jobbank_page: action.page,
                jobbank_page_size: action.size
            }
        case GET_APPLICATIONS_CANDIDATES:
            return {
                ...state,
                list_applications_candidates: action.payload,
                load_applications_candidates: action.fetching
            }
        case GET_SETUP_CONFIG:
            return {
                ...state,
                list_setup_config: action.payload,
            }
        case FETCH_SETUP_CONFIG: {
            return {
                ...state,
                load_setup_config: action.fetching
            }
        }
        case SET_PAGE:
            return { ...state, jobbank_page: action.payload }
        case SET_FILTERS:
            return { ...state, jobbank_filters: action.payload }
        default:
            return state;
    }
}

export const setJobbankPage = (num = 1) => (dispatch) => {
    dispatch({ type: SET_PAGE, payload: num })
}

export const setJobbankFilters = (data) => (dispatch) => {
    dispatch({ type: SET_FILTERS, payload: data })
}

export const getClients = (node, query = '', page = 1, size = 10) => async (dispatch) => {
    const typeFunction = { type: GET_CLIENTS, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getClients(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getClientsOptions = (node) => async (dispatch) => {
    const typeFunction = { type: GET_CLIENTS_OPTIONS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let param = '&paginate=0&is_active=true';
        let response = await WebApiJobBank.getClients(node, param);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getVacancies = (node, query = '', page = 1, size = 10) => async (dispatch) => {
    const typeFunction = { type: GET_VACANCIES, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getVacancies(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getVacanciesOptions = (node, query = '') => async (dispatch) => {
    const typeFunction = { type: GET_VACANCIES_OPTIONS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getVacancies(node, `&paginate=0${query}`);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getVacantFields = (node) => async (dispatch) => {
    const typeFunction = { type: GET_VACANCIES_FIELDS, payload: {}, fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getVacantFields(node);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getStrategies = (node, query = '', page = 1, size = 10) => async (dispatch) => {
    const typeFunction = { type: GET_STRATEGIES, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getStrategies(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getStrategiesOptions = (node, query = '') => async (dispatch) => {
    const typeFunction = { type: GET_STRATEGIES_OPTIONS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getStrategies(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getProfilesList = (node, query = '', page = 1, size = 10) => async (dispatch) => {
    const typeFunction = { type: GET_PROFILES, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getProfilesList(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getProfilesTypes = (node) => async (dispatch) => {
    const typeFunction = { type: GET_PROFILES_TYPES, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getProfilesTypes(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getProfilesOptions = (node) => async (dispatch) => {
    const typeFunction = { type: GET_PROFILES_OPTIONS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getProfilesList(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getCandidates = (node, query = '', page = 1, size = 10) => async (dispatch) => {
    const typeFunction = { type: GET_CANDIDATES, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getCandidates(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getCandidatesOptions = (node) => async (dispatch) => {
    const typeFunction = { type: GET_CANDIDATES_OPTIONS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let params = '&type=single&paginate=0';
        let response = await WebApiJobBank.getCandidates(node, params);
        dispatch({ ...typeFunction, payload: response.data });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getPublications = (node, query = '', page = 1, size = 10) => async (dispatch) => {
    const typeFunction = { type: GET_PUBLICATIONS, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getPublications(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getSectors = (node) => async (dispatch) => {
    const typeFunction = { type: GET_SECTORS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getSectors(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        dispatch(typeFunction)
        console.log(e)
    }
}

export const getCompetences = (node) => async (dispatch) => {
    const typeFunction = { type: GET_COMPETENCES, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getCompetences(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        dispatch(typeFunction)
        console.log(e)
    }
}

export const getAcademics = (node) => async (dispatch) => {
    const typeFunction = { type: GET_ACADEMICS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getAcademics(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        dispatch(typeFunction)
        console.log(e)
    }
}

export const getMainCategories = (node) => async (dispatch) => {
    const typeFunction = { type: GET_MAIN_CATEGORIES, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getMainCategories(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getSubCategories = (node) => async (dispatch) => {
    const typeFunction = { type: GET_SUB_CATEGORIES, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getSubCategories(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getConnections = (node, query = '', page = 1) => async (dispatch) => {
    const typeFunction = { type: GET_CONNECTIONS, payload: {}, fetching: false, query, page };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getConnections(node, query);
        dispatch({ ...typeFunction, payload: response.data });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getConnectionsOptions = (node, query = '') => async (dispatch) => {
    const typeFunction = { type: GET_CONNECTIONS_OPTIONS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getConnections(node, `&paginate=0${query}`);
        dispatch({ ...typeFunction, payload: response.data.results });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getJobBoards = (node) => async (dispatch) => {
    const typeFunction = { type: GET_JOBBOARDS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getJobBoards(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getListStates = (node) => async (dispatch) => {
    const typeFunction = { type: GET_STATES, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true });
    try {
        let response = await WebApiJobBank.getListStates(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getListSelection = (node, query = '', page = 1, size = 10) => async (dispatch) => {
    const typeFunction = { type: GET_SELECTION, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getListSelection(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getSelectionOpions = (node, query = '') => async (dispatch) => {
    const typeFunction = { type: GET_SELECTION_OPTIONS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getListSelection(node, `&paginate=0${query}`);
        dispatch({ ...typeFunction, payload: response.data });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getPreselection = (node, query = '', page = 1, size = 10) => async (dispatch) => {
    const typeFunction = { type: GET_PRESELECTION, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        if (!query.includes('vacant')) {
            setTimeout(() => { dispatch(typeFunction) }, 1000);
            return;
        }
        let response = await WebApiJobBank.getCandidates(node, `&is_active=true${query}`);
        dispatch({ ...typeFunction, payload: response.data });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getScholarship = (node) => async (dispatch) => {
    const typeFunction = { type: GET_SCHOLARSHIP, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getScholarship(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getTagsNotification = (node) => async (dispatch) => {
    const typeFunction = { type: GET_TAGS_NOTIFICATION, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getTagsNotification(node, '&paginate=0');
        dispatch({ ...typeFunction, payload: response.data?.results });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getInterviews = (node, query = '', page = 1) => async (dispatch) => {
    const typeFunction = { type: GET_INTERVIEWS, payload: [], fetching: false, query, page };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getInterviews(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getApplications = (node, query = '', page = 1, size = 10) => async (dispatch) => {
    const typeFunction = { type: GET_APPLICATIONS, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        // const { jobBankStore: { list_applications } } = getState();
        let response = await WebApiJobBank.getApplications(node, query);
        dispatch({ ...typeFunction, payload: response.data });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getApplicationsCandidates = (node, query = '') => async (dispatch) => {
    const typeFunction = { type: GET_APPLICATIONS_CANDIDATES, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getApplicationsCandidates(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
    }
}

export const getVacanciesSearch = (node, query = '', page = 1, size = 10) => async (dispatch, getState) => {
    const { jobBankStore: { list_vacancies_search } } = getState();
    const typeFunction = { type: GET_VACANCIES_SEARCH, payload: list_vacancies_search, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiJobBank.getVacanciesSearch(node, query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getSetupConfig = () => async (dispatch, getState) => {
    const { jobBankStore: { list_setup_config } } = getState();
    const typeData = { type: GET_SETUP_CONFIG, payload: list_setup_config };
    const typeFetch = { type: FETCH_SETUP_CONFIG, fetching: false };
    // dispatch({ ...typeFetch, fetching: Object.keys(list_setup_config)?.length <= 0 })
    try {
        let response = await WebApiJobBank.getSetupConfig();
        dispatch({ ...typeData, payload: response.data });
        setTimeout(() => {
            dispatch(typeFetch)
        }, 1000);
    } catch (e) {
        console.log(e)
        dispatch(typeData)
        dispatch(typeFetch)
    }
}

export default jobBankReducer;
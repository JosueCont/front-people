import WebApiTimeclock from '../api/WebApiTimeclock';

const initialState = {
    list_work_centers: {},
    load_work_centers: false,
    list_logs_events: {},
    load_logs_events: false,
    list_companies: [],
    load_companies: false,
    list_work_centers_options: [],
    load_work_centers_options: false,
    timeclock_page: 1,
    timeclock_filters: "",
    timeclock_page_size: 10,
    timeclock_filters_data: {}
}

const GET_WORK_CENTERS = "GET_WORK_CENTERS";
const GET_WORK_CENTERS_OPTIONS = "GET_WORK_CENTERS_OPTIONS";

const GET_LOGS_EVENTS = "GET_LOGS_EVENTS";
const GET_COMPANIES = "GET_COMPANIES";

const SET_FILTERS_DATA = "SET_FILTERS_DATA";

const timeclockReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_WORK_CENTERS:
            return {
                ...state,
                list_work_centers: action.payload,
                load_work_centers: action.fetching,
                timeclock_page: action.page,
                timeclock_filters: action.query,
                timeclock_page_size: action.size
            }
        case GET_WORK_CENTERS_OPTIONS:
            return {
                ...state,
                list_work_centers_options: action.payload,
                load_work_centers_options: action.fetching,
            }
        case GET_LOGS_EVENTS:
            return {
                ...state,
                list_logs_events: action.payload,
                load_logs_events: action.fetching,
                timeclock_page: action.page,
                timeclock_filters: action.query,
                timeclock_page_size: action.size
            }
        case GET_COMPANIES:
            return {
                ...state,
                list_companies: action.payload,
                load_companies: action.fetching
            }
        case SET_FILTERS_DATA:
            return {
                ...state,
                timeclock_filters_data: {
                    ...state.timeclock_filters_data,
                    ...action.payload
                }
            }
        default:
            return state;
    }
}

export const setTimeclockFiltersData = (data = {}) => (dispatch) => {
    dispatch({ type: SET_FILTERS_DATA, payload: data })
}

export const getWorkCenters = (query = '', page = 1, size = 10) => async (dispatch) => {
    const typeFunction = { type: GET_WORK_CENTERS, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let params = `?is_deleted=false${query}`
        let response = await WebApiTimeclock.getWorkCenters(params);
        dispatch({ ...typeFunction, payload: response.data });
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getWorkCentersOptions = (node, query = '') => async (dispatch) => {
    const typeFunction = { type: GET_WORK_CENTERS_OPTIONS, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let params = `?paginate=0&node=${node}&is_deleted=false&is_active=true`;
        let response = await WebApiTimeclock.getWorkCenters(params);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getLogsEvents = (query = '', page = 1, size = 10) => async (dispatch, getState) => {
    const typeFunction = { type: GET_LOGS_EVENTS, payload: {}, fetching: false, query, page, size };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiTimeclock.getLogsEvents(query);
        dispatch({ ...typeFunction, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export const getCompanies = (query = '') => async (dispatch) => {
    const typeFunction = { type: GET_COMPANIES, payload: [], fetching: false };
    dispatch({ ...typeFunction, fetching: true })
    try {
        let response = await WebApiTimeclock.getCompanies(query);
        dispatch({ ...typeFunction, payload: response.data?.results })
    } catch (e) {
        console.log(e)
        dispatch(typeFunction)
    }
}

export default timeclockReducer;
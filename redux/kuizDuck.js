import WebApiAssessment from '../api/WebApiAssessment';
import { orderBy } from 'lodash';

const initialState = {
    list_assessments: {},
    load_assessments: false,
    list_categories: [],
    load_categories: false,
    list_assessments_options: [],
    load_assessments_options: false,
    list_sections: {},
    load_sections: false,
    list_questions: {},
    load_questions: false,
    list_answers: {},
    load_answers: false,
    list_groups: [],
    load_groups: false,
    list_profiles: [],
    load_profiles: false,
    kuiz_page: 1,
    kuiz_filters: "",
    kuiz_page_size: 10
}

const GET_ASSESSMENTS = "GET_ASSESSMENTS";
const GET_ASSESSMENTS_OPTIONS = "GET_ASSESSMENTS_OPTIONS";
const GET_CATEGORIES = "GET_CATEGORIES";
const GET_SECTIONS = "GET_SECTIONS";
const GET_QUESTIONS = "GET_QUESTIONS";
const GET_ANSWERS = "GET_GET_ANSWERS";
const GET_GROUPS = "GET_GROUPS";
const GET_PROFILES = "GET_PROFILES";

const kuizReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ASSESSMENTS:
            return {
                ...state,
                list_assessments: action.payload,
                load_assessments: action.fetching,
                kuiz_filters: action.query
            }
        case GET_CATEGORIES:
            return {
                ...state,
                list_categories: action.payload,
                load_categories: action.fetching
            }
        case GET_ASSESSMENTS_OPTIONS:
            return {
                ...state,
                list_assessments_options: action.payload,
                load_assessments_options: action.fetching
            }
        case GET_SECTIONS:
            return {
                ...state,
                list_sections: action.payload,
                load_sections: action.fetching
            }
        case GET_QUESTIONS:
            return {
                ...state,
                list_questions: action.payload,
                load_questions: action.fetching
            }
        case GET_ANSWERS:
            return {
                ...state,
                list_answers: action.payload,
                load_answers: action.fetching
            }
        case GET_GROUPS:
            return {
                ...state,
                list_groups: action.payload,
                load_groups: action.fetching
            }
        case GET_PROFILES:
            return {
                ...state,
                list_profiles: action.payload,
                load_profiles: action.fetching
            }
        default:
            return state
    }
}

export const getAssessments = (node, query = '') => async (dispatch, getState) => {
    // const { kuizStore: { list_assessments } } = getState();
    const action = { type: GET_ASSESSMENTS, payload: {}, fetching: false, query };
    dispatch({ ...action, fetching: true })
    try {
        let response = await WebApiAssessment.getListSurveys(node, query);
        dispatch({ ...action, payload: { results: response.data } });
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export const getAssessmentsOptions = (node, query = '') => async (dispatch) => {
    const action = { type: GET_ASSESSMENTS_OPTIONS, payload: [], fetching: false }
    dispatch({ ...action, fetching: true })
    try {
        let params = `&is_active=true${query}`
        let response = await WebApiAssessment.getListSurveys(node, params);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export const getSections = (id) => async (dispatch) => {
    const action = { type: GET_SECTIONS, payload: {}, fetching: false }
    dispatch({ ...action, fetching: true })
    try {
        let response = await WebApiAssessment.assessmentSections(id);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export const getQuestions = (id) => async (dispatch) => {
    const action = { type: GET_QUESTIONS, payload: {}, fetching: false };
    dispatch({ ...action, fetching: true })
    try {
        let response = await WebApiAssessment.assessmentQuestions(id);
        let results = orderBy(response?.data?.results || [], ['order'], ['asc']);
        dispatch({ ...action, payload: { results } })
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export const getAnswers = (id) => async (dispatch) => {
    const action = { type: GET_ANSWERS, payload: {}, fetching: false };
    dispatch({ ...action, fetching: true })
    try {
        let response = await WebApiAssessment.assessmentAnswers(id);
        let results = orderBy(response?.data?.results || [], ['order'], ['asc']);
        dispatch({ ...action, payload: { ...response.data, results } });
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export const getCategories = () => async (dispatch) => {
    const action = { type: GET_CATEGORIES, payload: [], fetching: false }
    dispatch({ ...action, fetching: true })
    try {
        let response = await WebApiAssessment.getCategoriesAssessment();
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(type)
    }
}

export const getGroups = (node, query = '') => async (dispatch) => {
    const action = { type: GET_GROUPS, payload: [], fetching: false };
    dispatch({ ...action, fetching: true })
    try {
        let response = await WebApiAssessment.getGroupsAssessments(node, query);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export const getProfiles = (node, query = '') => async (dispatch) => {
    const action = { type: GET_PROFILES, payload: [], fetching: false };
    dispatch({ ...action, fetching: true })
    try {
        let response = await WebApiAssessment.getProfiles(node, query);
        dispatch({ ...action, payload: response.data })
    } catch (e) {
        console.log(e)
        dispatch(action)
    }
}

export default kuizReducer;